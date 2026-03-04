import express from "express";
import cors from "cors";
import convertRoutes from "./routes/convert.routes";
import compressRoutes from "./routes/compress.routes";
import backgroundRoutes from "./routes/background.routes";
import resizeRoutes from "./routes/resize.routes";
import cropRoutes from "./routes/crop.routes";

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

export default app;