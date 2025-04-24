import { Column } from "../types/types";

export const convertToCSV = (data: any[], columns: Column[]): string => {
  const header = columns.map((col) => col.label).join(",");
  const rows = data.map((row) => columns.map((col) => row[col.id]).join(","));
  return [header, ...rows].join("\n");
};
