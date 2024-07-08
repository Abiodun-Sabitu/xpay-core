/*
  Warnings:

  - You are about to drop the column `documentary` on the `KYC` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `addressDocument` to the `KYC` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KYC" DROP COLUMN "documentary",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "addressDocument" TEXT NOT NULL,
ADD COLUMN     "bvn" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "middleName" TEXT;
