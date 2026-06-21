import prisma from "../../config/prisma.js";

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