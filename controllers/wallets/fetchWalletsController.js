import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchWallets = async (req, res) => {
  const userId = req.user; // Set from isAuthenticated middleware

  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      select: {
        id: true,
        accountNumber: true,
        currency: true,
        balance: true, // Assume balance is already formatted as a string in the database
      },
    });

    res.status(200).json({
      message: "Wallets retrieved successfully",
      wallets,
    });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch wallets", error: { error } });
  }
};
