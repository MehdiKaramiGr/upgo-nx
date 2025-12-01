import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { validateQuery } from "@/lib/validate-query";
import { aclFileQueryDto, aclFileTogglePayloadDto } from "@/dto/acl/acl-dto";
import { validateBody } from "@/lib/validate-body";
import { dashboardQueryDto } from "@/dto/dashboard/dashboard-dto";
import { serializeBigInt } from "@/lib/serialize-big-int";

export async function GET(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;
    let query = validateQuery(req, dashboardQueryDto);
    console.log("query", new Date(query.start), new Date(query.end));

    let stats: any = {};

    let transactions = [];
    transactions.push(
      prisma.users.count({
        where: {
          created_at: {
            gte: new Date(query.start),
            lte: new Date(query.end),
          },
        },
      })
    );

    transactions.push(
      prisma.file.count({
        where: {
          is_deleted: false,

          created_at: {
            gte: new Date(query.start),
            lte: new Date(query.end),
          },
        },
      })
    );

    transactions.push(
      prisma.file.aggregate({
        where: {
          is_deleted: false,

          created_at: {
            gte: new Date(query.start),
            lte: new Date(query.end),
          },
        },
        _sum: {
          size: true,
        },
      })
    );

    transactions.push(
      prisma.file.count({
        where: {
          is_deleted: true,
          created_at: {
            gte: new Date(query.start),
            lte: new Date(query.end),
          },
        },
      })
    );

    transactions.push(
      prisma.file.aggregate({
        where: {
          is_deleted: true,
          created_at: {
            gte: new Date(query.start),
            lte: new Date(query.end),
          },
        },
        _sum: {
          size: true,
        },
      })
    );

    transactions.push(
      prisma.$queryRaw<{ day: string; totalSize: number | null }[]>`
    SELECT 
      TO_CHAR("created_at", 'YYYY-MM-DD') AS day,
      SUM(size)::bigint AS "totalSize"
    FROM file
    WHERE 
      is_deleted = false
      AND "created_at" >= ${new Date(query.start)}
      AND "created_at" <= ${new Date(query.end)}
    GROUP BY day
    ORDER BY day ASC
  `
    );
    transactions.push(
      prisma.$queryRaw<{ day: string; totalSize: number | null }[]>`
    SELECT 
      TO_CHAR("created_at", 'YYYY-MM-DD') AS day,
      SUM(size)::bigint AS "totalSize"
    FROM file
    WHERE 
      is_deleted = true
      AND "created_at" >= ${new Date(query.start)}
      AND "created_at" <= ${new Date(query.end)}
    GROUP BY day
    ORDER BY day ASC
  `
    );

    let result = await prisma.$transaction(transactions);

    stats.UsersCount = result?.[0];
    stats.FilesCount = result?.[1];
    stats.FilesSize = (result?.[2] as any)?._sum?.size;
    stats.DiskSpace = process.env.DISK_SPACE;
    stats.DeletedFilesCount = result?.[3];
    stats.DeletedFilesSize = (result?.[4] as any)?._sum?.size;
    const daily = result[5] as {
      day: string;
      totalSize: bigint | number | null;
    }[];
    stats.DailyUploadedSizes = daily.map(serializeBigInt);
    const dailyDeleted = result[6] as {
      day: string;
      totalSize: bigint | number | null;
    }[];
    stats.DailyDeletedSizes = dailyDeleted.map(serializeBigInt);

    return Response.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
