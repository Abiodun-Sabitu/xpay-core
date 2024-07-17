import { PrismaClient } from "@prisma/client";
import { generateAccountNumber } from "../../helpers/accountNumberGenerator.js";
import { getOpeningBalance } from "../../helpers/balanceConverters.js";
import { sendVerificationEmail } from "../../services/emailService.js";
import { accountCreationMail } from "../../emails/accountCreationMail.js";

const prisma = new PrismaClient();

const createFxWallet = async (req, res) => {
  const userId = req.user;
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
        .json({ message: `You already have a ${currency} wallet.` });
    }

    const checkKYCStatus = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkKYCStatus.kycVerified) {
      return res.status(409).json({
        message: `Please complete your KYC to operate an FX wallet.`,
      });
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
    console.error(`Failed to create ${currency} wallet:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createFxWallet;
