/*
  Warnings:

  - Added the required column `position` to the `QueueEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueueEntry" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "position" INTEGER NOT NULL;
