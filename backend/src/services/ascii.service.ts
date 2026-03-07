import axios from "axios";
import FormData from "form-data";

export async function generateAsciiWithPython(
  imageBuffer: Buffer
): Promise<string> {

  const formData = new FormData();

  formData.append("file", imageBuffer, {
    filename: "image.png",
    contentType: "image/png",
  });

  const response = await axios.post(
    "http://127.0.0.1:8000/ascii",
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return response.data.ascii;
}