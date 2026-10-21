import app from "./app";
const PORT = 5000;
import imageSketch from "./routes/imageSketch";

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
app.use("/api/images", imageSketch);

