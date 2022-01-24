/*
  Warnings:

  - A unique constraint covering the columns `[userConfirmEmailId]` on the table `UserConfirmedEmail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserConfirmedEmail_userConfirmEmailId_key" ON "UserConfirmedEmail"("userConfirmEmailId");
