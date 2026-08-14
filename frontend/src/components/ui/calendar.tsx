"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-2",
        month_caption: "flex justify-center items-center h-8 font-semibold",
        nav: "flex items-center justify-between absolute inset-x-1 top-0 h-8",
        button_previous:
          "h-7 w-7 flex items-center justify-center rounded border border-gray-800 hover:bg-gray-100",
        button_next:
          "h-7 w-7 flex items-center justify-center rounded border border-gray-800 hover:bg-gray-100",
        weekdays: "flex",
        weekday: "w-8 text-center text-xs font-medium text-gray-500",
        weeks: "flex flex-col",
        week: "flex",
        day: "w-8 h-8 text-center text-sm p-0 relative",
        day_button:
          "w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center",
        selected: "[&>button]:bg-gray-800 [&>button]:text-white [&>button]:hover:bg-gray-800",
        today: "[&>button]:font-bold [&>button]:underline",
        outside: "text-gray-300",
        disabled: "text-gray-300",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };
