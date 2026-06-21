import prisma from "../../config/prisma.js";

export const getQueue = async (req, res) => {
  try {
    const { shopId } = req.params;

    const queueEntries = await prisma.queueEntry.findMany({
      where: {
        shopId,
        status: {
          in: [
            "WAITING",
            "NOTIFIED",
            "ARRIVED",
            "SERVING"
          ]
        }
      },
      orderBy: {
        tokenNumber: "asc"
      }
    });

    const currentServing = queueEntries.find(
      entry => entry.status === "SERVING"
    );

    const queue = queueEntries.map((entry, index) => ({
      id: entry.id,
      tokenNumber: entry.tokenNumber,
      position: index + 1,
      customerName: entry.customerName,
      phoneNumber: entry.phoneNumber,
      status: entry.status,
      joinedAt: entry.joinedAt
    }));

    res.status(200).json({
      success: true,
      currentServing: currentServing
        ? currentServing.tokenNumber
        : null,
      waitingCount: queueEntries.filter(
        entry => entry.status === "WAITING"
      ).length,
      queue
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
