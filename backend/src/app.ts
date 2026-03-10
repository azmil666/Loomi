import express from "express";
import cors from "cors";
import convertRoutes from "./routes/convert.routes";
import compressRoutes from "./routes/compress.routes";
import backgroundRoutes from "./routes/background.routes";
import resizeRoutes from "./routes/resize.routes";
import cropRoutes from "./routes/crop.routes";
import stripMetadataRoutes from "./routes/stripMetadata.routes";
import bulkRoutes from "./routes/bulk.routes"
import blurRoutes from "./routes/blur.routes";
import asciiRoutes from "./routes/ascii.routes";
import imageRoutes from "./routes/imageRoutes";
import qrRoutes from "./routes/qr.routes";

const app = express();

app.use(cors());

app.get("/", (_req, res) => {
    res.send("Server is working 🚀");
});

app.use("/api/convert", convertRoutes);
app.use("/api/compress", compressRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/api/resize", resizeRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/strip-metadata", stripMetadataRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/blur", blurRoutes);
app.use("/api/ascii", asciiRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/qr", qrRoutes);

export default app;