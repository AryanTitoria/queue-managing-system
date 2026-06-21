import prisma from "../../config/prisma.js";

export const markArrived = async (req, res) => {
  try {
    const { queueEntryId } = req.body;

    const queueEntry = await prisma.queueEntry.findUnique({
      where: {
        id: queueEntryId,
      },
    });

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: "Queue entry not found",
      });
    }

    if (queueEntry.status !== "NOTIFIED") {
      return res.status(400).json({
        success: false,
        message: "Customer has not been notified",
      });
    }

    const updatedEntry = await prisma.queueEntry.update({
      where: {
        id: queueEntryId,
      },
      data: {
        status: "ARRIVED",
        arrivedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Customer marked as arrived",
      queueEntry: updatedEntry,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};