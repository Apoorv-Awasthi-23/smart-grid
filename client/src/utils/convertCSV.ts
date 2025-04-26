




import { Column } from "../types/types";


export const convertToCSV = <T>(data: T[], columns: Column<T>[]): string => {
  const headers = columns.map((col) => col.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.id];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );

  return [headers, ...rows].join("\n");
};
