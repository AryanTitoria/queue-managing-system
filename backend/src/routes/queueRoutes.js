import express from "express";
import { joinQueue, getQueue, fillChairs } from "../controllers/queueController.js";

const router = express.Router();

router.post("/join", joinQueue);
router.get("/:shopId", getQueue);
router.post("/fill-chairs", fillChairs);

export default router;