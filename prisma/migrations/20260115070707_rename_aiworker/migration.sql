/*
  Warnings:

  - You are about to drop the `AIWorker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIWorker" DROP CONSTRAINT "AIWorker_channelId_fkey";

-- DropTable
DROP TABLE "AIWorker";

-- CreateTable
CREATE TABLE "AiWorker" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "type" "WorkerType" NOT NULL,
    "status" "WorkerStatus" NOT NULL DEFAULT 'IDLE',
    "currentTask" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiWorker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiWorker" ADD CONSTRAINT "AiWorker_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
