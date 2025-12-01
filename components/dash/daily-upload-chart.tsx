"use client";
import { useStats } from "@/framework/dash/use-stats";
import bitToMB from "@/lib/bit-to-mb";
import { ApexOptions } from "apexcharts";
import { DotIcon } from "lucide-react";
import dynamic from "next/dynamic";
// import { MoreDotIcon } from "@/icons";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DailyUploadChart() {
  const stats = useStats();

  console.log("stats?.data", stats?.data?.DailyUploadedSizes);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: stats?.data?.DailyUploadedSizes?.map((v) => v.day),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${bitToMB(val)} MB`,
      },
    },
  };
  const series = [
    {
      name: "Uploads",
      data: (stats?.data?.DailyUploadedSizes ?? [])?.map((v) => v.totalSize),
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="bg-white dark:bg-primary-500/10 px-5 sm:px-6 pt-5 sm:pt-6 pb-10 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-white/90 text-lg">
          Daily Uploads
        </h3>

        <div className="inline-block relative">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <DotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 pl-2 min-w-[650px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
