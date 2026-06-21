import prisma from "../../config/prisma.js";

export const completeService = async (req, res) => {
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

    if (queueEntry.status !== "SERVING") {
      return res.status(400).json({
        success: false,
        message: "Customer is not being served",
      });
    }

    const updatedEntry = await prisma.queueEntry.update({
      where: {
        id: queueEntryId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Service completed",
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