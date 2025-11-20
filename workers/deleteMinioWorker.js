import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { minio } from "@/lib/minio";
import fs from "fs";
import path from "path";

const logFile = path.join(__dirname, "deleteMinioWorker.log");

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

async function processQueue() {
  console.log("Running daily MinIO deletion job...");

  const jobList = await prisma.file_deletion_queue.findMany({
    where: {
      attempts: {
        lt: 4,
      },
      locked_at: {
        lte: new Date(),
      },
    },
  });

  for (const job of jobList) {
    try {
      await minio.removeObject(job.bucket, job.object_key);

      let transactions = [];

      transactions.push(
        prisma.file.delete({
          where: { id: job.file_id },
        })
      );
      transactions.push(
        prisma.file_acl.deleteMany({
          where: { file_id: job.file_id },
        })
      );
      transactions.push(
        prisma.public_link.deleteMany({
          where: { file_id: job.file_id },
        })
      );
      transactions.push(
        prisma.file_version.deleteMany({
          where: { file_id: job.file_id },
        })
      );

      transactions.push(
        prisma.file_deletion_queue.delete({
          where: { id: job.id },
        })
      );

      await prisma.$transaction(transactions);
    } catch (err) {
      console.error("Delete failed:", err);

      await prisma.file_deletion_queue.update({
        where: { id: job.id },
        data: { attempts: { increment: 1 } },
      });
    }
  }

  log(`Daily deletion job finished - Processed ${jobList.length} jobs.`);
}

// Run *every day at 03:00 AM*
cron.schedule("0 3 * * *", async () => {
  try {
    await processQueue();
  } catch (err) {
    log(`Daily deletion job failed: ${err}`);
  }
});
