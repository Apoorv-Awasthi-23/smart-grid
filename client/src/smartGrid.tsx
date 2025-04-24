import React, { useEffect, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Filter, Sun, Moon } from "lucide-react";
import { SmartGridProps } from "./types/types";
import { convertToCSV } from "./utils/convertCSV";
import { downloadFile } from "./utils/download";

const SmartGrid = <T,>({
  data,
  columns,
  theme = "light",
  pageSize = 10,
  onRowEdit,
  height = 600,
  width = "100%",
}: SmartGridProps<T>) => {
  const [localData, setLocalData] = useState(data);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "des">("asc");
  const [mode, setMode] = useState<"light" | "dark">(theme);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<{ [key: string]: any }>({});
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [page, setPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState<number>(pageSize);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

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
        const cellValue = String(row[column.id] ?? "").toLowerCase();
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

  const handleSave = (rowIndex: number) => {
    const updatedRow = { ...localData[rowIndex], ...editRowData };
    const updatedData = [...localData];
    updatedData[rowIndex] = updatedRow;
    setLocalData(updatedData);
    setEditingRow(null);
    setEditRowData({});
    onRowEdit?.(updatedRow, rowIndex);
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = paginatedData[index];
    return (
      <div
        className={`flex ${
          mode === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"
        } `}
        style={style}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 p-3 truncate border-b border-gray-200"
            style={{ minWidth: `${100 / (columns.length + 1)}%` }}
          >
            {editingRow === index ? (
              <input
                type="text"
                value={editRowData[column.id] || row[column.id]}
                onChange={(e) =>
                  setEditRowData((prev) => ({
                    ...prev,
                    [column.id]: e.target.value,
                  }))
                }
                className={`p-1 rounded-md w-full ${
                  mode === "light"
                    ? "bg-white text-black"
                    : "bg-gray-800 text-white"
                }`}
              />
            ) : column.cellRenderer ? (
              column.cellRenderer(row[column.id], row)
            ) : (
              row[column.id]
            )}
          </div>
        ))}
        <div
          className="p-3 border-b border-gray-200"
          style={{ minWidth: `${100 / (columns.length + 1)}%` }}
        >
          {editingRow === index ? (
            <>
              <button
                onClick={() => handleSave(index)}
                className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingRow(null);
                  setEditRowData({});
                }}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditingRow(index);
                setEditRowData(row);
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  // Calculate the height for the List component
  const calculateListHeight = () => {
    const headerHeight = 120; // Height of the header section
    const paginationHeight = paginationEnabled ? 60 : 0; // Height of pagination controls
    const topControlsHeight = 100; // Height of top controls (theme toggle, export buttons)

    const totalHeight = typeof height === "string" ? parseInt(height) : height;
    return totalHeight - (headerHeight + paginationHeight + topControlsHeight);
  };

  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      } p-3 my-3 ${width?`w-${width}`:"w-full"}`}
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
        <div className="min-w-full">
          {/* Header */}
          <div className="flex">
            {columns.map((column) => (
              <div
                key={column.id}
                className={`flex p-3 font-medium uppercase tracking-wider border-b ${
                  mode === "light"
                    ? "text-gray-500 border-gray-200"
                    : "text-gray-300 border-gray-700"
                }`}
                style={{ minWidth: `${100 / (columns.length + 1)}%` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    {column.label}{" "}
                    {sortCol === column.id && (sortDir === "asc" ? "↑" : "↓")}
                  </div>
                  <button
                    onClick={() => toggleFilter(column.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${
                      activeFilter === column.id ? "bg-gray-200" : ""
                    }`}
                  >
                    <Filter size={16} />
                  </button>
                </div>
                {activeFilter === column.id && (
                  <input
                    type="text"
                    value={filters[column.id] || ""}
                    onChange={(e) =>
                      handleFilterChange(column.id, e.target.value)
                    }
                    className={`mt-2 p-1 rounded-md w-full ${
                      mode === "light"
                        ? "bg-white text-black"
                        : "bg-gray-800 text-white"
                    }`}
                    placeholder={`Filter ${column.label}`}
                  />
                )}
              </div>
            ))}
            <div
              className={`p-3 font-medium uppercase tracking-wider border-b ${
                mode === "light"
                  ? "text-gray-500 border-gray-200"
                  : "text-gray-300 border-gray-700"
              }`}
              style={{ minWidth: `${100 / (columns.length + 1)}%` }}
            >
              Actions
            </div>
          </div>

          {/* Body */}
          <List
            height={calculateListHeight()}
            itemCount={paginatedData.length}
            itemSize={52}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </div>

      {paginationEnabled && (
        <div className="flex justify-end items-center gap-4 mt-4 text-black">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span
            className={`${
              mode === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <input
            type="number"
            min={1}
            value={clientPageSize}
            onChange={(e) =>
              setClientPageSize(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 px-2 py-1 border rounded text-black"
          />
        </div>
      )}
    </div>
  );
};

export default SmartGrid;
