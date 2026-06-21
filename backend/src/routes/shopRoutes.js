import express from "express";

import { createShop } from "../controllers/shop/create.js";
import { loginShop } from "../controllers/shop/login.js";
import { getDashboardStats } from "../controllers/shop/getDashboard.js";

const router = express.Router();

router.post("/create", createShop);
router.post("/login", loginShop);
router.get("/dashboard/:shopId", getDashboardStats);

export default router;