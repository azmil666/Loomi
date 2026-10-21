import axios from "axios";
import FormData from "form-data";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export async function removeBgWithPython(imageBuffer: Buffer): Promise<Buffer> {
  const formData = new FormData();
  formData.append("file", imageBuffer, {
    filename: "image.png",
    contentType: "image/png",
  });

  const response = await axios.post(
    `${ML_SERVICE_URL}/remove-bg`,
    formData,
    {
      headers: formData.getHeaders(),
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(response.data);
}