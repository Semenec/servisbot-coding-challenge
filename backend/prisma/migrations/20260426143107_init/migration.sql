-- CreateEnum
CREATE TYPE "BotStatus" AS ENUM ('DISABLED', 'ENABLED', 'PAUSED');

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "BotStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "bot_id" TEXT NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Worker_bot_id_created_at_idx" ON "Worker"("bot_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Log_bot_id_created_at_idx" ON "Log"("bot_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Log_bot_id_worker_id_created_at_idx" ON "Log"("bot_id", "worker_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Log_worker_id_idx" ON "Log"("worker_id");

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
