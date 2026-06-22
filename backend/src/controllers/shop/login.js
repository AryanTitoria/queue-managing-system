import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

export const loginShop = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const shop = await prisma.shop.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      shop.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        shopId: shop.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const { password: _, ...shopWithoutPassword } = shop;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      shop: shopWithoutPassword,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};