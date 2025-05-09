import React, { useEffect, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Sun, Moon } from "lucide-react";

import GridHeader from "./components/gridHeader";
import Pagination from "./components/pagination";

import { convertToCSV } from "./utils/convertCSV";
import { downloadFile } from "./utils/download";

import Row from "./components/gridRow";

import { SmartGridProps } from "./types";

const SmartGrid = <T,>({
  data,
  columns,
  theme = "light",
  pageSize = 10,
  onRowEdit,
  height = 600,
  width = "100%",
  onDataChange,
}: SmartGridProps<T>) => {
  const [localData, setLocalData] = useState(data);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "des">("asc");
  const [mode, setMode] = useState<"light" | "dark">(theme);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [page, setPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState<number>(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLocalData(data);
      setIsLoading(false);
    }, 600);
  }, [data]);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setIsLoading(false);
    }, 400);
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [columnId]: value }));
  };

  const toggleFilter = (columnId: string) => {
    setActiveFilter(activeFilter === columnId ? null : columnId);
  };

  const filteredData = useMemo(() => {
    return localData.filter((row) =>
      columns.every((column) => {
        const filterValue = filters[column.id]?.toLowerCase() || "";
        const cellValue = String(
          (row as Record<string, any>)[column.id] ?? ""
        ).toLowerCase();
        return cellValue.includes(filterValue);
      })
    );
  }, [localData, filters, columns]);

  const handleSort = (columnId: string) => {
    if (sortCol === columnId) {
      setSortDir(sortDir === "asc" ? "des" : "asc");
    } else {
      setSortCol(columnId);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortCol) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortCol as keyof typeof a];
      const bValue = b[sortCol as keyof typeof b];
      return sortDir === "asc"
        ? aValue < bValue
          ? -1
          : aValue > bValue
          ? 1
          : 0
        : aValue > bValue
        ? -1
        : aValue < bValue
        ? 1
        : 0;
    });
  }, [filteredData, sortCol, sortDir]);

  const paginatedData = useMemo(() => {
    if (!paginationEnabled) return sortedData;
    const start = (page - 1) * clientPageSize;
    return sortedData.slice(start, start + clientPageSize);
  }, [sortedData, page, clientPageSize, paginationEnabled]);

  const totalPages = Math.ceil(sortedData.length / clientPageSize);

  const handleSave = (rowIndex: number, updatedRow: T) => {
    const updatedData = [...localData];
    updatedData[rowIndex] = updatedRow;
    setLocalData(updatedData);
    setEditingRow(null);
    onRowEdit?.(updatedRow, rowIndex);
    onDataChange?.(updatedData);
  };

  const calculateListHeight = () => {
    const headerHeight = 120;
    const paginationHeight = paginationEnabled ? 60 : 0;
    const topControlsHeight = 100;
    const totalHeight = typeof height === "string" ? parseInt(height) : height;
    return totalHeight - (headerHeight + paginationHeight + topControlsHeight);
  };

  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      } p-3 my-3 ${width ? `w-${width}` : "w-full"}`}
      style={{ width, height }}
    >
      <div className="flex justify-between items-center py-3">
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={`p-2 rounded-md hover:bg-opacity-80 transition-colors ${
            mode === "light" ? "bg-gray-200" : "bg-gray-700"
          }`}
        >
          {mode === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() =>
              downloadFile(
                "smartgrid_export.csv",
                convertToCSV(localData, columns),
                "text/csv"
              )
            }
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Export CSV
          </button>
          <button
            onClick={() =>
              downloadFile(
                "smartgrid_export.json",
                JSON.stringify(localData, null, 2),
                "application/json"
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end mb-2">
        <label className="mr-2">Pagination:</label>
        <input
          type="checkbox"
          checked={paginationEnabled}
          onChange={() => setPaginationEnabled((prev) => !prev)}
          className="mr-4"
        />
      </div>

      <div className="w-full overflow-x-auto py-3 border border-gray-700 rounded-lg shadow-sm">
        <div className="min-w-[700px]">
          <GridHeader
            columns={columns}
            mode={mode}
            sortCol={sortCol}
            sortDir={sortDir}
            activeFilter={activeFilter}
            filters={filters}
            toggleFilter={toggleFilter}
            handleSort={handleSort}
            handleFilterChange={handleFilterChange}
          />

          <List
            height={calculateListHeight()}
            itemCount={isLoading ? clientPageSize : paginatedData.length}
            itemSize={52}
            width="100%"
          >
            {({ index, style }) => (
              <Row
                index={index}
                style={style}
                paginatedData={paginatedData}
                columns={columns}
                mode={mode}
                isLoading={isLoading}
                editingRow={editingRow}
                setEditingRow={setEditingRow}
                handleSave={handleSave}
              />
            )}
          </List>
        </div>
      </div>

      {paginationEnabled && (
        <Pagination
          page={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          clientPageSize={clientPageSize}
          setClientPageSize={setClientPageSize}
          mode={mode}
        />
      )}
    </div>
  );
};

export default SmartGrid;
