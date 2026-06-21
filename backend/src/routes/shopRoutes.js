import express from "express";
import { createShop, loginShop, getDashboardStats } from "../controllers/shopController.js";

const router = express.Router();

router.post("/create", createShop);
router.post("/login", loginShop);
router.get("/dashboard/:shopId", getDashboardStats);

export default router;