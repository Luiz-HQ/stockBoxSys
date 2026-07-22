/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authUserId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "authUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_authUserId_key" ON "users"("authUserId");
