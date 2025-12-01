"use client";
import React from "react";
// import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIcon,
  GroupIcon,
  HardDriveIcon,
  Users2Icon,
} from "lucide-react";
import { Badge } from "@heroui/react";
import { useStats } from "@/framework/dash/use-stats";
// import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const UsersMetrics = () => {
  const stats = useStats();
  return (
    <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2">
      {/* <!-- Metric Item Start --> */}
      <div className="bg-white dark:bg-primary-500/10 p-5 md:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-xl w-12 h-12">
          <Users2Icon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div className="flex justify-between items-end mt-5">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.data?.UsersCount ?? 0}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="bg-white dark:bg-primary-500/10 p-5 md:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl">
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-xl w-12 h-12">
          <HardDriveIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex justify-between items-end mt-5">
          <div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Files Uploaded
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats?.data?.FilesCount ?? 0}
            </h4>
          </div>

          {/* <Badge color="danger">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
