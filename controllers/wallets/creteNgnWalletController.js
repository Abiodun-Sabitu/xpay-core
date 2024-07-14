// walletRoutes.js
import express from "express";
import { isAuthenticated } from "./authMiddleware.js";
import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../../helpers/accountNumberGenerator.js";
import { getOpeningBalance } from "../../helpers/balanceConverters.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create-ngn-wallet", isAuthenticated, async (req, res) => {
  const userId = req.user.id; // Assuming user id is set from auth middleware
  const currency = "NGN"; // Fixed currency for this endpoint

  try {
    const existingWallet = await prisma.wallet.findFirst({
      where: { userId, currency },
    });

    if (existingWallet) {
      return res
        .status(409)
        .json({ message: "you can only have one NGN wallet." });
    }

    const accountNumber = generateAccountNumber(currency);
    const openingBalance = getOpeningBalance(); // Get the standard opening balance

    const newWallet = await prisma.wallet.create({
      data: {
        userId,
        accountNumber,
        currency,
        balance: openingBalance, // Use the standardized opening balance
      },
    });

    res.status(201).json({
      message: "NGN Wallet created successfully.",
      wallet: newWallet,
    });
  } catch (error) {
    console.error("Failed to create NGN wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
