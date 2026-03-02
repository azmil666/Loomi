import express from "express";
import cors from "cors";
import convertRoutes from "./routes/convert.routes";
import compressRoutes from "./routes/compress.routes";
import backgroundRoutes from "./routes/background.routes";


const app = express();

app.use(cors());

app.get("/", (_req, res) => {
    res.send("Server is working 🚀");
});

app.use("/api/convert", convertRoutes);
app.use("/api/compress", compressRoutes);
app.use("/api/background-remove", backgroundRoutes);

export default app;