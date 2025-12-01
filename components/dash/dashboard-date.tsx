"use client";
import { DatePicker } from "@heroui/react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function DashboardDate() {
  const searchParams = (() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return useSearchParams();
  })();
  const router = useRouter();

  const now = new Date();
  const endDefault = parseDate(now.toISOString().slice(0, 10));
  const monthAgoDate = new Date();
  monthAgoDate.setMonth(monthAgoDate.getMonth() - 1);
  const startDefault = parseDate(monthAgoDate.toISOString().slice(0, 10));

  const [startDate, setStartDate] = useState(
    searchParams.get("start")
      ? parseDate(searchParams.get("start")!)
      : startDefault
  );

  const [endDate, setEndDate] = useState(
    searchParams.get("end") ? parseDate(searchParams.get("end")!) : endDefault
  );

  let formatter = useDateFormatter({ dateStyle: "full" });

  useEffect(() => {
    const hasStart = searchParams.get("start");
    const hasEnd = searchParams.get("end");

    if (!hasStart || !hasEnd) {
      updateQuery(startDate, endDate);
    }
  }, []);

  function updateQuery(start: any, end: any) {
    const params = new URLSearchParams(window.location.search);
    params.set("start", start.toString());
    params.set("end", end.toString());
    router.replace("?" + params.toString());
  }

  return (
    <div className="flex gap-4 w-full">
      <DatePicker
        size="sm"
        variant="faded"
        className="max-w-[284px]"
        label="Start date"
        value={startDate}
        onChange={(v) => {
          if (v !== null) {
            setStartDate(v);
            updateQuery(v, endDate);
          }
        }}
      />
      <DatePicker
        size="sm"
        variant="faded"
        className="max-w-[284px]"
        label="End date"
        value={endDate}
        onChange={(v) => {
          if (v !== null) {
            setEndDate(v);
            updateQuery(startDate, v);
          }
        }}
      />
    </div>
  );
}
