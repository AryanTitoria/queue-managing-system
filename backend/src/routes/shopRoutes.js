import express from "express";
import { createShop, loginShop } from "../controllers/shopController.js";

const router = express.Router();

router.post("/create", createShop);
router.post("/login", loginShop);

export default router;