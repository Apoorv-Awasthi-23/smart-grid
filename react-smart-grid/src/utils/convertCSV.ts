
import { Column } from "../types/index";
export const convertToCSV = <T>(data: T[], columns: Column<T>[]): string => {
  const headers = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        //@ts-ignore
        const value = row[col.id];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );

  return [headers, ...rows].join("\n");
};
