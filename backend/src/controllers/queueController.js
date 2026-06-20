import prisma from "../config/prisma.js";

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

export const fillChairs = async (req, res) => {
  try {
    const { shopId } = req.body;

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

    const occupiedSlots = await prisma.queueEntry.count({
      where: {
        shopId,
        status: {
          in: [
            "NOTIFIED",
            "ARRIVED",
            "SERVING",
          ],
        },
      },
    });

    const availableChairs =
      shop.numberOfChairs - occupiedSlots;

    if (availableChairs <= 0) {
      return res.status(200).json({
        success: true,
        message: "No chairs available",
      });
    }

    const waitingCustomers =
      await prisma.queueEntry.findMany({
        where: {
          shopId,
          status: "WAITING",
        },
        orderBy: {
          tokenNumber: "asc",
        },
        take: availableChairs,
      });

    if (waitingCustomers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No waiting customers",
      });
    }

    const ids = waitingCustomers.map(
      customer => customer.id
    );

    await prisma.queueEntry.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: "NOTIFIED",
        notificationSent: true,
        notifiedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Customers notified",
      notifiedCustomers: waitingCustomers.map(
        customer => ({
          tokenNumber: customer.tokenNumber,
          customerName: customer.customerName,
        })
      ),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};