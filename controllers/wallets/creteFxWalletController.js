// walletRoutes.js
import express from "express";
import { isAuthenticated } from "./authMiddleware.js";
import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../../helpers/accountNumberGenerator.js";
import { getOpeningBalance } from "../../helpers/balanceConverters.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-fx-wallet", isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const { currency } = req.body; // 'GBP' or 'USD'

  // Validate currency
  if (!["GBP", "USD"].includes(currency)) {
    return res
      .status(400)
      .json({ message: "Invalid currency. Only GBP or USD allowed." });
  }

  try {
    const existingWallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (existingWallet) {
      return res
        .status(409)
        .json({ message: `User already has a ${currency} wallet.` });
    }

    const accountNumber = generateAccountNumber(currency);
    const openingBalance = getOpeningBalance(); // Get the standard opening balance
    const newWallet = await prisma.wallet.create({
      data: {
        userId,
        accountNumber,
        currency,
        balance: openingBalance,
      },
    });

    res.status(201).json({
      message: `${currency} Wallet created successfully.`,
      wallet: newWallet,
    });
  } catch (error) {
    console.error(`Failed to create ${currency} wallet:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
