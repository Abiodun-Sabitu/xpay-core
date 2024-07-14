/*
  Warnings:

  - You are about to drop the column `kycId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `KYC` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kycProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_kycId_fkey";

-- DropIndex
DROP INDEX "User_kycId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "kycId",
ADD COLUMN     "kycProfileId" TEXT,
ADD COLUMN     "verificationToken" TEXT;

-- DropTable
DROP TABLE "KYC";

-- CreateTable
CREATE TABLE "KYCProfile" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "street" TEXT NOT NULL,
    "photo" TEXT,
    "bvn" TEXT,
    "address" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "addressDocument" TEXT NOT NULL,
    "validID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "KYCProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KYCProfile_userId_key" ON "KYCProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kycProfileId_key" ON "User"("kycProfileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_kycProfileId_fkey" FOREIGN KEY ("kycProfileId") REFERENCES "KYCProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
