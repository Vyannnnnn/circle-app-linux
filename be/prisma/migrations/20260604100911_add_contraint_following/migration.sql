/*
  Warnings:

  - A unique constraint covering the columns `[followingId,followerId]` on the table `following` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "following_followingId_followerId_key" ON "following"("followingId", "followerId");
