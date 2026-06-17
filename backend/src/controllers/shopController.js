import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export const createShop = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      phoneNumber,
      password,
      numberOfChairs,
    } = req.body;

    const existingShop = await prisma.shop.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Shop already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await prisma.shop.create({
      data: {
        shopName,
        ownerName,
        phoneNumber,
        password: hashedPassword,
        numberOfChairs,
      },
    });

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error(error);

    const { password: _, ...shopWithoutPassword } = shop;

    res.status(201).json({
    success: true,
    message: "Shop created successfully",
    shop: shopWithoutPassword,
    });
  }
};