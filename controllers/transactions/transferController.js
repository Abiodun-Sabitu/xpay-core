// walletTransferController.js
import { PrismaClient } from "@prisma/client";
import { numeralize, deNumeralize } from "../../helpers/balanceConverters.js";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

const walletTransfer = async (req, res) => {
  const userId = req.user;
  const { senderWalletId, receiverWalletId, amount, description } = req.body; // amount is now a number from the frontend
  console.log("Received payload:", req.body);

  const amountSent = new Decimal(amount); // Convert the numerical amount to Decimal for computation

  // Fetch both wallets concurrently
  const [senderWallet, receiverWallet] = await Promise.all([
    prisma.wallet.findUnique({ where: { accountNumber: senderWalletId } }),
    prisma.wallet.findUnique({ where: { accountNumber: receiverWalletId } }),
  ]);
  console.log("Sender Wallet:", senderWallet);
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

    // const result = await prisma.$transaction(async (prisma) => {
    //   // Deduct from sender
    //   const updatedSenderWallet = await prisma.wallet.update({
    //     where: { id: senderWallet.id },
    //     data: {
    //       balance: deNumeralize(
    //         numeralize(senderWallet.balance).minus(amountSent)
    //       ),
    //     },
    //   });

    //   // Add to receiver
    //   const updatedReceiverWallet = await prisma.wallet.update({
    //     where: { id: receiverWallet.id },
    //     data: {
    //       balance: deNumeralize(
    //         numeralize(receiverWallet.balance).plus(amountSent)
    //       ),
    //     },
    //   });

    //   const transaction = await prisma.transaction.create({
    //     data: {
    //       senderWallet: {
    //         connect: { id: senderWallet.id },
    //       },
    //       receiverWallet: {
    //         connect: { id: receiverWallet.id },
    //       },
    //       senderName: `${senderDetails.firstName} ${senderDetails.lastName}`,
    //       receiverName: `${receiverDetails.firstName} ${receiverDetails.lastName}`,
    //       type: "Transfer",
    //       amount: deNumeralize(amountSent),
    //       description: description,
    //     },
    //   });

    //   return { updatedSenderWallet, updatedReceiverWallet, transaction };
    // });
    const result = await prisma.$transaction(async (prisma) => {
      let updatedSenderWallet, updatedReceiverWallet, transaction;
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
        updatedSenderWallet = senderWallet;
        updatedReceiverWallet = receiverWallet;
      } else {
        // Normal transfer between different wallets
        updatedSenderWallet = await prisma.wallet.update({
          where: { id: senderWallet.id },
          data: {
            balance: deNumeralize(
              numeralize(senderWallet.balance).minus(amountSent)
            ),
          },
        });

        updatedReceiverWallet = await prisma.wallet.update({
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

      return { updatedSenderWallet, updatedReceiverWallet, transaction };
    });

    // Construct and send the success response
    res.status(200).json({
      message: "Transfer successful.",
      transactionDetails: {
        transactionId: result.transaction.id,
        type: result.transaction.type,
        amount: result.transaction.amount,
        date: result.transaction.createdAt,
        description: result.transaction.description,
        sender: {
          id: result.updatedSenderWallet.userId,
          name: result.transaction.senderName,
          walletId: result.updatedSenderWallet.accountNumber,
          balance: result.updatedSenderWallet.balance,
        },
        receiver: {
          id: result.updatedReceiverWallet.userId,
          name: result.transaction.receiverName,
          walletId: result.updatedReceiverWallet.accountNumber,
          balance: result.updatedReceiverWallet.balance,
        },
      },
    });
  } catch (error) {
    console.error(`Failed to complete transfer: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default walletTransfer;
