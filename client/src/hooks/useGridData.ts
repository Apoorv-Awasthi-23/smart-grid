import { useMemo } from "react";
import { Column, FilterState } from "../types/types";
import { sortData } from "../utils/sorting";

export const useGridData = <T>(
  data: T[],
  filters: FilterState,
  sortCol: keyof T | null,
  sortDir: "asc" | "des",
  columns: Column<T>[],
  page: number,
  pageSize: number,
  paginationEnabled: boolean
) => {
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((column) => {
        const filterValue = filters[column.id]?.toLowerCase() || "";
        const cellValue = String(row[column.id] ?? "").toLowerCase();
        return cellValue.includes(filterValue);
      })
    );
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
    return sortData(filteredData, sortCol, sortDir);
  }, [filteredData, sortCol, sortDir]);

  const paginatedData = useMemo(() => {
    if (!paginationEnabled) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, paginationEnabled]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return {
    paginatedData,
    totalPages,
  };
};
