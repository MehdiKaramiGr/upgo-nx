-- CreateTable
CREATE TABLE "file_deletion_queue" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "object_key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_deletion_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "file_deletion_queue_locked_at_idx" ON "file_deletion_queue"("locked_at");
