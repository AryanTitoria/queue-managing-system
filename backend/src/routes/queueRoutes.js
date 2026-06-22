import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { joinQueue } from "../controllers/queue/joinQueue.js";
import { getQueue } from "../controllers/queue/getQueue.js";
import { fillChairs } from "../controllers/queue/fillChairs.js";
import { markArrived } from "../controllers/queue/arrived.js";
import { startService } from "../controllers/queue/startService.js";
import { completeService } from "../controllers/queue/completeService.js";
import { skipCustomer } from "../controllers/queue/skipCustomer.js";

const router = express.Router();

router.post("/join", joinQueue);
router.get("/:shopId", getQueue);
router.post("/fill-chairs", protect, fillChairs);
router.post("/arrived", protect, markArrived);
router.post("/start-service", protect, startService);
router.post("/complete", protect, completeService);
router.post("/skip", protect, skipCustomer);

export default router;