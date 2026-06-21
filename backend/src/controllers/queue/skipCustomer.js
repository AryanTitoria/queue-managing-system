import prisma from "../../config/prisma.js";

export const skipCustomer = async (req, res) => {
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

    if (
      queueEntry.status === "SERVING" ||
      queueEntry.status === "COMPLETED" ||
      queueEntry.status === "SKIPPED"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot skip customer with status ${queueEntry.status}`,
      });
    }

    const updatedEntry = await prisma.queueEntry.update({
      where: {
        id: queueEntryId,
      },
      data: {
        status: "SKIPPED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Customer skipped successfully",
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