import express from "express";
import { joinQueue, getQueue } from "../controllers/queueController.js";

const router = express.Router();

router.post("/join", joinQueue);
router.get("/:shopId", getQueue);

export default router;