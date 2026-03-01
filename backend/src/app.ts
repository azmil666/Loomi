import express from "express";
import cors from "cors";
import convertRoutes from "./routes/convert.routes";

const app = express();

app.use(cors());

app.get("/", (_req, res) => {
    res.send("Server is working 🚀");
});

app.use("/api/convert", convertRoutes);

export default app;