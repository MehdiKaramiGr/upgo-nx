"use client";
import { useStats } from "@/framework/dash/use-stats";
import bitToMB from "@/lib/bit-to-mb";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DotSquareIcon } from "lucide-react";

import dynamic from "next/dynamic";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { MoreDotIcon } from "@/icons";
import { useState } from "react";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DisksMetrics() {
  const stats = useStats();

  let availibleSpace = stats?.data
    ? ((stats?.data?.FilesSize + stats?.data?.DeletedFilesSize) /
        stats.data.DiskSpace) *
      100
    : 0;

  let deleteQueueSize = stats?.data
    ? (stats?.data?.DeletedFilesSize / stats.data.DiskSpace) * 100
    : 0;

  let curFiles = stats?.data
    ? (stats?.data?.FilesSize / stats.data.DiskSpace) * 100
    : 0;

  console.log("availibleSpace", availibleSpace);
  const series = [availibleSpace, deleteQueueSize, curFiles];
  const options: ApexOptions = {
    colors: ["#465FFF", "#E33712", "#19E312"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "60%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: true,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF", "#E33712", "#19E312"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="bg-gray-100 dark:bg-primary-500/10 border border-gray-200 dark:border-gray-800 rounded-2xl">
      <div className="bg-white dark:bg-gray-900 shadow-default px-5 sm:px-6 pt-5 sm:pt-6 pb-11 rounded-2xl">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white/90 text-lg">
              Disks Metric
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              From the {bitToMB(stats?.data?.DiskSpace ?? 0)} MB availible space
              on your server mechince
            </p>
          </div>
          <div className="inline-block relative">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <DotSquareIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          {/* <span className="top-full left-1/2 absolute bg-success-50 dark:bg-success-500/15 px-3 py-1 rounded-full font-medium text-success-600 dark:text-success-500 text-xs -translate-x-1/2 -translate-y-[95%]">
            +10%
          </span> */}
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-gray-500 text-sm sm:text-base text-center">
          You've used{" "}
          <span className="text-primary">{availibleSpace.toFixed(2)}%</span>{" "}
          which{" "}
          <span className="text-danger">{deleteQueueSize?.toFixed(2)}%</span> of
          it are on the Delete queue (they've been soft deleted for now) and
          <span className="text-success">{curFiles?.toFixed(2)}%</span> of it
          are on the User's files
        </p>
      </div>

      <div className="flex justify-center items-center gap-5 sm:gap-8 px-6 py-3.5 sm:py-5">
        <div>
          <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm text-center">
            Current Files
          </p>
          <p className="flex justify-center items-center gap-1 font-semibold text-gray-800 dark:text-white/90 text-base sm:text-lg">
            {stats.data?.FilesCount}
          </p>
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 w-px h-7"></div>

        <div>
          <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm text-center">
            Hard delete Queue
          </p>
          <p className="flex justify-center items-center gap-1 font-semibold text-danger text-base sm:text-lg">
            {stats.data?.DeletedFilesCount}
          </p>
        </div>
        {/* 
        <div className="bg-gray-200 dark:bg-gray-800 w-px h-7"></div>

        <div>
          <p className="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm text-center">
            Today
          </p>
          <p className="flex justify-center items-center gap-1 font-semibold text-gray-800 dark:text-white/90 text-base sm:text-lg">
            $20K
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              />
            </svg>
          </p>
        </div> */}
      </div>
    </div>
  );
}
