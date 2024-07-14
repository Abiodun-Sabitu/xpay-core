import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../../helpers/accountNumberGenerator.js";
import { getOpeningBalance } from "../../helpers/balanceConverters.js";
import { sendVerificationEmail } from "../../services/emailService.js";
import { accountCreationMail } from "../../emails/accountCreationMail.js";

const prisma = new PrismaClient();

const createNgnWallet = async (req, res) => {
  const userId = req.user; // Assuming user id is set from auth middleware
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const subject = `X-PAY ${newWallet.currency} WALLET CREATION`;
    await sendVerificationEmail(
      user.email,
      accountCreationMail(newWallet.accountNumber, newWallet.currency),
      subject
    );
  } catch (error) {
    console.error("Failed to create NGN wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createNgnWallet;
