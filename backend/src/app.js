import express from "express";
import cors from "cors";

import shopRoutes from "./routes/shopRoutes.js";

const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({
            message: "Queue Management System API Running",
        });
    });

    app.use("/api/shop", shopRoutes);

export default app;