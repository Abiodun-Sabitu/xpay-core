/*
  Warnings:

  - Added the required column `receiverId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL,
ALTER COLUMN "amount" SET DEFAULT '0.00',
ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DEFAULT 'Transfer';
