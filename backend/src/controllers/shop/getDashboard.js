import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    const [
      waiting,
      notified,
      arrived,
      serving,
      completed,
      skipped,
    ] = await Promise.all([
      prisma.queueEntry.count({
        where: {
          shopId,
          status: "WAITING",
        },
      }),

      prisma.queueEntry.count({
        where: {
          shopId,
          status: "NOTIFIED",
        },
      }),

      prisma.queueEntry.count({
        where: {
          shopId,
          status: "ARRIVED",
        },
      }),

      prisma.queueEntry.count({
        where: {
          shopId,
          status: "SERVING",
        },
      }),

      prisma.queueEntry.count({
        where: {
          shopId,
          status: "COMPLETED",
        },
      }),

      prisma.queueEntry.count({
        where: {
          shopId,
          status: "SKIPPED",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        waiting,
        notified,
        arrived,
        serving,
        completed,
        skipped,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};