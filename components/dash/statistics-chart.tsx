"use client";
import React from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import { useStats } from "@/framework/dash/use-stats";
import bitToMB from "@/lib/bit-to-mb";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const stats = useStats();

  console.log(
    "xx",
    stats?.data?.DailyDeletedSizes?.map((v) => v.day),
    stats?.data?.DailyUploadedSizes?.map((v) => v.day)
  );

  const deletedDays = stats?.data?.DailyDeletedSizes?.map((v) => v.day) ?? [];
  const uploadedDays = stats?.data?.DailyUploadedSizes?.map((v) => v.day) ?? [];

  const mergedDays = Array.from(
    new Set([...deletedDays, ...uploadedDays])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#f40404"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
      y: {
        formatter: (val: number) => `${bitToMB(val)} MB`,
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: mergedDays,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Uploaded",
      data: mergedDays?.map(
        (v) =>
          stats?.data?.DailyUploadedSizes?.find((i) => i.day == v)?.totalSize ??
          null
      ),
    },
    {
      name: "Deleted Files",
      data: mergedDays?.map(
        (v) =>
          stats?.data?.DailyDeletedSizes?.find((i) => i.day == v)?.totalSize ??
          null
      ),
    },
  ];
  return (
    <div className="bg-white dark:bg-primary-500/10 px-5 sm:px-6 pt-5 sm:pt-6 pb-5 border border-gray-200 dark:border-gray-800 rounded-2xl">
      <div className="flex sm:flex-row flex-col sm:justify-between gap-5 mb-6">
        <div className="w-full">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 text-lg">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Operational Storage Metrics
          </p>
        </div>
        <div className="flex sm:justify-end items-start gap-3 w-full">
          {/* <ChartTab /> */}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
