import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const nameEnquiry = async (req, res) => {
  const { walletNumber } = req.body; // Wallet number received from the request body

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { accountNumber: walletNumber },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    const ownerName = `${wallet.user.firstName} ${wallet.user.lastName}`;

    res.status(200).json({
      message: "Name enquiry successful.",
      ownerName: ownerName,
    });
  } catch (error) {
    console.error("Failed to fetch wallet owner's name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default nameEnquiry;
