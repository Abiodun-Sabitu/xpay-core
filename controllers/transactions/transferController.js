import { PrismaClient } from "@prisma/client";
import { numeralize, deNumeralize } from "../../helpers/balanceConverters.js";
import Decimal from "decimal.js";
import { sendMail } from "../../services/emailService.js";
import { debitAlertMail } from "../../emails/debitAlert.js";
import { creditAlertMail } from "../../emails/creditAlert.js";

const prisma = new PrismaClient();

const walletTransfer = async (req, res) => {
  const userId = req.user;
  const { senderWalletId, receiverWalletId, amount, description } = req.body; // amount is now a number from the frontend
  // console.log("Received payload:", req.body);

  const amountSent = new Decimal(amount); // Convert the numerical amount to Decimal for computation

  // Fetch both wallets concurrently
  const [senderWallet, receiverWallet] = await Promise.all([
    prisma.wallet.findUnique({ where: { accountNumber: senderWalletId } }),
    prisma.wallet.findUnique({ where: { accountNumber: receiverWalletId } }),
  ]);

  try {
    // Validate existence of both wallets
    if (!senderWallet) {
      return res.status(404).json({ message: "Sender's wallet not valid" });
    }

    if (!receiverWallet) {
      return res
        .status(404)
        .json({ message: "Receiver's wallet not found please cross check." });
    }

    // Ensure both wallets have the same currency
    if (senderWallet.currency !== receiverWallet.currency) {
      return res
        .status(400)
        .json({ message: "Transfers must be within the same currency type." });
    }

    // Validate user ownership
    if (senderWallet.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only transfer from your own wallet." });
    }

    //check if sender has sufficient balance to transact
    if (amountSent.greaterThan(numeralize(senderWallet.balance))) {
      return res
        .status(400)
        .json({ message: "Insufficient funds, please fund your account." });
    }

    // Check KYC limits for NGN wallet transfers
    if (
      senderWallet.currency === "NGN" &&
      !req.user.kycVerified &&
      amountSent.greaterThan(new Decimal(200000))
    ) {
      return res.status(403).json({
        message:
          "KYC verification needed for transfers above NGN200,000.00 Please complete KYC verification for higher limits.",
      });
    }

    // Fetch user details
    const senderDetails = await prisma.user.findUnique({
      where: { id: senderWallet.userId },
    });
    const receiverDetails = await prisma.user.findUnique({
      where: { id: receiverWallet.userId },
    });

    // Proceed with the transfer and record the transaction

    const result = await prisma.$transaction(async (prisma) => {
      let updateSenderWallet, updateReceiverWallet, transaction;
      if (senderWallet.id === receiverWallet.id) {
        // If it's a self-transfer, update the transaction log only
        transaction = await prisma.transaction.create({
          data: {
            senderWallet: { connect: { id: senderWallet.id } },
            receiverWallet: { connect: { id: receiverWallet.id } },
            senderName: `${senderDetails.firstName} ${senderDetails.lastName}`,
            receiverName: `${receiverDetails.firstName} ${receiverDetails.lastName}`,
            type: "Transfer",
            amount: deNumeralize(amountSent),
            description,
          },
        });
        // No actual balance change, just return current state
        updateSenderWallet = senderWallet;
        updateReceiverWallet = receiverWallet;
      } else {
        // Normal transfer between different wallets
        updateSenderWallet = await prisma.wallet.update({
          where: { id: senderWallet.id },
          data: {
            balance: deNumeralize(
              numeralize(senderWallet.balance).minus(amountSent)
            ),
          },
        });

        updateReceiverWallet = await prisma.wallet.update({
          where: { id: receiverWallet.id },
          data: {
            balance: deNumeralize(
              numeralize(receiverWallet.balance).plus(amountSent)
            ),
          },
        });

        transaction = await prisma.transaction.create({
          data: {
            senderWallet: { connect: { id: senderWallet.id } },
            receiverWallet: { connect: { id: receiverWallet.id } },
            senderName: `${senderDetails.firstName} ${senderDetails.lastName}`,
            receiverName: `${receiverDetails.firstName} ${receiverDetails.lastName}`,
            type: "Transfer",
            amount: deNumeralize(amountSent),
            description,
          },
        });
      }

      return { updateSenderWallet, updateReceiverWallet, transaction };
    });

    const transactionDetails = {
      transactionId: result.transaction.id,
      type: result.transaction.type,
      amount: `${senderWallet.currency} ${result.transaction.amount}`,
      date: result.transaction.createdAt,
      description: result.transaction.description,
      sender: {
        id: result.updateSenderWallet.userId,
        name: result.transaction.senderName,
        walletId: result.updateSenderWallet.accountNumber,
        // balance: result.updateSenderWallet.balance,
      },
      receiver: {
        id: result.updateReceiverWallet.userId,
        name: result.transaction.receiverName,
        walletId: result.updateReceiverWallet.accountNumber,
        // balance: result.updateReceiverWallet.balance,
      },
    };

    const DebitMailSubject = "x-PAY WALLET DEBIT ALERT NOTIFICATION";
    await sendMail(
      senderDetails.email,
      debitAlertMail(transactionDetails, senderDetails.firstName),
      DebitMailSubject
    );

    const CreditMailSubject = "x-PAY WALLET CREDIT ALERT NOTIFICATION ";
    await sendMail(
      receiverDetails.email,
      creditAlertMail(transactionDetails, receiverDetails.firstName),
      CreditMailSubject
    );

    // Construct and send the success response
    res.status(200).json({
      message: "Transfer successful.",
      transactionDetails,
    });
  } catch (error) {
    console.error(`Failed to complete transfer: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default walletTransfer;
