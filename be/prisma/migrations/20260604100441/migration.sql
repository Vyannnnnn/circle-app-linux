/*
  Warnings:

  - A unique constraint covering the columns `[threadId,userId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "likes_threadId_userId_key" ON "likes"("threadId", "userId");
