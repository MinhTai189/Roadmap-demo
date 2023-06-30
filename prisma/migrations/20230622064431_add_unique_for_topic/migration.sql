/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_userId_key" ON "Topic"("name", "userId");
