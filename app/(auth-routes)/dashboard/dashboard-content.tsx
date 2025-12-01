"use client";
import MonthlyTarget from "@/components/dash/disks-metrics";
import DailyUploadChart from "@/components/dash/daily-upload-chart";
import StatisticsChart from "@/components/dash/statistics-chart";
import { UsersMetrics } from "@/components/dash/users-metrics";
import { DatePicker } from "@heroui/react";
import DashboardDate from "@/components/dash/dashboard-date";
import { Suspense } from "react";

function DashboardContentDetail() {
  return (
    <div className="gap-4 md:gap-6 grid grid-cols-12 p-3">
      <div className="flex justify-between items-center col-span-12 mb-4">
        <h1 className="font-semibold text-gray-800 dark:text-white/90 text-2xl">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <DashboardDate />
        </div>
      </div>
      <div className="space-y-6 col-span-12 xl:col-span-7">
        <UsersMetrics />

        <DailyUploadChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContentDetail />
    </Suspense>
  );
}
