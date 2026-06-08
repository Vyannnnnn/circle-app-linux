/*
  Warnings:

  - You are about to drop the column `createdBy` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `threads` table. All the data in the column will be lost.
  - Added the required column `userId` to the `threads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_createdBy_fkey";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "createdBy",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "threads" DROP COLUMN "createdBy",
DROP COLUMN "likesCount",
DROP COLUMN "updatedBy",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "likes_threadId_idx" ON "likes"("threadId");

-- CreateIndex
CREATE INDEX "replies_userId_idx" ON "replies"("userId");

-- CreateIndex
CREATE INDEX "replies_threadId_idx" ON "replies"("threadId");

-- CreateIndex
CREATE INDEX "threads_userId_idx" ON "threads"("userId");

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
