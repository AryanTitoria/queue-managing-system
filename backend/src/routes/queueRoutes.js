import express from "express";
import { joinQueue } from "../controllers/queueController.js";

const router = express.Router();

router.post("/join", joinQueue);

export default router;