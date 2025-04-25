import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { Sun, Moon } from "lucide-react";
import {
  SmartGridProps,
  FilterState,
  SortDirection,
  ThemeMode,
} from "./types/types";
import { convertToCSV } from "./utils/convertCSV";
import { downloadFile } from "./utils/download";
import { useGridData } from "./hooks/useGridData";
import GridHeader from "./components/GridHeader";
import GridRow from "./components/GridRow";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Pagination from "./components/Pagination";

const SmartGrid = <T,>({
  data,
  columns,
  theme = "light",
  pageSize = 10,
  onRowEdit,
}: SmartGridProps<T>) => {
  const [localData, setLocalData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [sortCol, setSortCol] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [mode, setMode] = useState<ThemeMode>(theme);
  const [filters, setFilters] = useState<FilterState>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<{ [key: string]: any }>({});
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const [page, setPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState<number>(pageSize);

  const { paginatedData, totalPages } = useGridData(
    localData,
    filters,
    sortCol,
    sortDir,
    columns,
    page,
    clientPageSize,
    paginationEnabled
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    setLocalData(data);
    return () => clearTimeout(timer);
  }, [data]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [columnId]: value }));
  };

  const toggleFilter = (columnId: string) => {
    setActiveFilter(activeFilter === columnId ? null : columnId);
  };

  const handleSort = (columnId: string) => {
    if (sortCol === columnId) {
      setSortDir(sortDir === "asc" ? "des" : "asc");
    } else {
      setSortCol(columnId as keyof T);
      setSortDir("asc");
    }
  };

  // Fixed handleEdit function to properly initialize editRowData
  const handleEdit = (index: number, row: T) => {
    setEditingRow(index);

    // Create a clean copy of the row data to edit
    const rowToEdit: { [key: string]: any } = {};
    columns.forEach((column) => {
      rowToEdit[column.id] = row[column.id as keyof T];
    });

    setEditRowData(rowToEdit);
  };

  // Fixed handleSave function to properly update the data
  const handleSave = (rowIndex: number) => {
    // Find the actual row index in the localData array
    // This is important if you're using pagination or filters
    const actualIndex = paginationEnabled
      ? (page - 1) * clientPageSize + rowIndex
      : rowIndex;

    // Create a new row with the updated values
    const baseRow = { ...localData[actualIndex] };

    // Apply all edits from editRowData to the row
    Object.keys(editRowData).forEach((key) => {
      baseRow[key as keyof T] = editRowData[key];
    });

    // Update the localData state with the new data
    const updatedData = [...localData];
    updatedData[actualIndex] = baseRow;
    setLocalData(updatedData);

    // Reset editing state
    setEditingRow(null);
    setEditRowData({});

    // Call the onRowEdit callback if provided
    if (onRowEdit) {
      onRowEdit(baseRow, actualIndex);
    }
  };

  // Fixed handleEditDataChange function
  const handleEditDataChange = (columnId: string, value: string) => {
    setEditRowData((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const Row = ({ index }: { index: number }) => {
    const row = paginatedData[index];
    return (
      <GridRow
        index={index}
        row={row}
        columns={columns}
        mode={mode}
        editingRow={editingRow}
        editRowData={editRowData}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={() => {
          setEditingRow(null);
          setEditRowData({});
        }}
        onEditDataChange={handleEditDataChange}
      />
    );
  };

  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      } p-3 my-3`}
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
          {loading ? (
            <LoadingSkeleton columns={columns} mode={mode} />
          ) : (
            <>
              <GridHeader
                columns={columns}
                mode={mode}
                sortCol={sortCol as string | null}
                sortDir={sortDir}
                activeFilter={activeFilter}
                filters={filters}
                onSort={handleSort}
                onFilterToggle={toggleFilter}
                onFilterChange={handleFilterChange}
              />

              <List
                height={400}
                itemCount={paginatedData.length}
                itemSize={52}
                width="100%"
              >
                {Row}
              </List>
            </>
          )}
        </div>
      </div>

      {paginationEnabled && (
        <Pagination
          page={page}
          totalPages={totalPages}
          clientPageSize={clientPageSize}
          mode={mode}
          onPageChange={setPage}
          onPageSizeChange={setClientPageSize}
        />
      )}
    </div>
  );
};

export default SmartGrid;
