from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import Response
from rembg import remove
import torch
import cv2
import io
from PIL import Image, ImageEnhance
import numpy as np

app = FastAPI()

model_type = "MiDaS_small"
midas = torch.hub.load("intel-isl/MiDaS", model_type, trust_repo=True)
midas.to("cpu")
midas.eval()

transform = torch.hub.load("intel-isl/MiDaS", "transforms", trust_repo=True).small_transform

gscale = "@%#*+=-:. "

def convert_image_to_ascii(image: Image.Image, cols: int = 80, scale: float = 0.43):
    # grayscale
    image = image.convert("L")
    
    image = ImageEnhance.Contrast(image).enhance(2.5)
    image = ImageEnhance.Sharpness(image).enhance(2.0)
    

    # increase contrast
    image = ImageEnhance.Contrast(image).enhance(2.0)

    # slight sharpening
    image = ImageEnhance.Sharpness(image).enhance(1.5)

    W, H = image.size

    w = W / cols
    h = w / scale

    rows = int(H / h)

    ascii_img = []

    for j in range(rows):

        y1 = int(j * h)
        y2 = int((j + 1) * h)

        if j == rows - 1:
            y2 = H

        row_chars = ""

        for i in range(cols):

            x1 = int(i * w)
            x2 = int((i + 1) * w)

            if i == cols - 1:
                x2 = W

            tile = image.crop((x1, y1, x2, y2))

            avg = int(np.array(tile).mean())

            char = gscale[int((avg * (len(gscale) - 1)) / 255)]

            row_chars += char

        ascii_img.append(row_chars)

    return "\n".join(ascii_img)

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    input_bytes = await file.read()
    output_bytes = remove(input_bytes)
    return Response(content=output_bytes, media_type="image/png")


@app.post("/depth")
async def generate_depth(
    file: UploadFile = File(...),
    mode: str = Query("color", description="grayscale | color | overlay")
):
    input_bytes = await file.read()

    image = Image.open(io.BytesIO(input_bytes)).convert("RGB")
    img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    max_width = 512
    if img.shape[1] > max_width:
        scale = max_width / img.shape[1]
        img = cv2.resize(img, None, fx=scale, fy=scale)

    input_batch = transform(img)

    with torch.no_grad():
        prediction = midas(input_batch)
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=img.shape[:2],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

    depth = prediction.cpu().numpy()

    
    depth = cv2.normalize(depth, None, 0, 255, cv2.NORM_MINMAX)
    depth = depth.astype(np.uint8)

    depth = cv2.equalizeHist(depth)

  
    if mode == "grayscale":
        output = depth

    elif mode == "color":
        output = cv2.applyColorMap(depth, cv2.COLORMAP_INFERNO)

    elif mode == "overlay":
        depth_float = depth.astype(np.float32) / 255.0


        blurred = cv2.GaussianBlur(img, (21, 21), 0)

        mask = cv2.normalize(depth_float, None, 0, 1, cv2.NORM_MINMAX)

        mask = cv2.GaussianBlur(mask, (11, 11), 0)

        mask_3c = np.stack([mask]*3, axis=-1)

        output = img * mask_3c + blurred * (1 - mask_3c)
        output = np.clip(output, 0, 255).astype(np.uint8)
    else:
        return Response(
            content=b"Invalid mode. Use grayscale | color | overlay",
            media_type="text/plain",
            status_code=400
        )
    
    _, encoded_img = cv2.imencode(".png", output)

    return Response(
        content=encoded_img.tobytes(),
        media_type="image/png"
    )

@app.post("/ascii")
async def image_to_ascii(file: UploadFile = File(...)):
    input_bytes = await file.read()

    image = Image.open(io.BytesIO(input_bytes)).convert("RGB")

    ascii_art = convert_image_to_ascii(image)

    return {"ascii": ascii_art}