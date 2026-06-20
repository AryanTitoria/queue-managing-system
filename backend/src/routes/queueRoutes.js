import express from "express";
import { joinQueue, getQueue, fillChairs, markArrived, startService, completeService } from "../controllers/queueController.js";

const router = express.Router();

router.post("/join", joinQueue);
router.get("/:shopId", getQueue);
router.post("/fill-chairs", fillChairs);
router.post("/arrived", markArrived);
router.post("/start-service", startService);
router.post("/complete", completeService);

export default router;