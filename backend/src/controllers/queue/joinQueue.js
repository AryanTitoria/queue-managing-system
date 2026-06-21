import prisma from "../../config/prisma.js";

export const joinQueue = async (req, res) => {
  try {
    const {
      shopId,
      customerName,
      phoneNumber
    } = req.body;

    if (!shopId || !customerName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    const existingEntry = await prisma.queueEntry.findFirst({
      where: {
        shopId,
        phoneNumber,
        status: {
          in: [
            "WAITING",
            "NOTIFIED",
            "ARRIVED",
            "SERVING",
          ],
        },
      },
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Customer already has an active queue entry",
      });
    }

    const lastEntry = await prisma.queueEntry.findFirst({
      where: {
        shopId,
      },
      orderBy: {
        tokenNumber: "desc",
      },
    });

    const nextToken = lastEntry
      ? lastEntry.tokenNumber + 1
      : 1;

    const lastPosition = await prisma.queueEntry.findFirst({
      where: {
        shopId,
        status: {
          in: [
            "WAITING",
            "NOTIFIED",
            "ARRIVED",
            "SERVING",
          ],
        },
      },
      orderBy: {
        position: "desc",
      },
    });

    const nextPosition = lastPosition
      ? lastPosition.position + 1
      : 1;

    const queueEntry = await prisma.queueEntry.create({
      data: {
        customerName,
        phoneNumber,
        tokenNumber: nextToken,
        position: nextPosition,
        shopId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Joined queue successfully",
      tokenNumber: queueEntry.tokenNumber,
      position: queueEntry.position,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};