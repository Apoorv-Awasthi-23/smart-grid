import  { useEffect, useMemo, useState } from "react";
import {  SmartGridProps } from "./types/types";
import { convertToCSV } from "./utils/convertCSV";
import { downloadFile } from "./utils/download";

const SmartGrid = <T,>({
  data,
  columns,
  pageSize = 2,
  theme = "light",
  onRowEdit,
}: SmartGridProps<T>) => {
  const [localData, setLocalData] = useState(data);
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "des">("asc");
  const [mode, setMode] = useState<"light" | "dark">(theme);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [columnId]: value }));
  };

 const filteredData = useMemo(() => {
   return localData.filter((row) => {
     return columns.every((column) => {
       const filterValue = filters[column.id]?.toLowerCase() || "";
       const cellValue = String(row[column.id] ?? "").toLowerCase();
       return cellValue.includes(filterValue);
     });
   });
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

  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(localData.length / pageSize);

  const handleSave = (rowIndex: number) => {
    const updatedRow = { ...localData[rowIndex], ...editRowData };
    const updatedData = [...localData];
    updatedData[rowIndex] = updatedRow;
    setLocalData(updatedData);
    setEditingRow(null);
    setEditRowData({});
    onRowEdit?.(updatedRow, rowIndex);
  };

  return (
    <div
      className={
        mode === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      }
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          <span
            className={`p-2 rounded-md ${
              mode === "light" ? "bg-gray-200" : "bg-gray-800"
            }`}
          >
            {mode === "light" ? "Dark" : "Light"}
          </span>
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
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="p-2"
                onClick={() => column.sortable && handleSort(column.id)}
              >
                {column.label}{" "}
                {sortCol === column.id && (sortDir === "asc" ? "↑" : "↓")}
                <input
                  type="text"
                  value={filters[column.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.id, e.target.value)
                  }
                  className={`p-1 rounded-md ${
                    mode === "light"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white"
                  }`}
                  placeholder={`Filter ${column.label}`}
                />
              </th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.id} className="p-2">
                  {editingRow === rowIndex ? (
                    <input
                      type="text"
                      value={editRowData[column.id] || row[column.id]}
                      onChange={(e) =>
                        setEditRowData((prev) => ({
                          ...prev,
                          [column.id]: e.target.value,
                        }))
                      }
                      className={`p-1 rounded-md ${
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
                </td>
              ))}
              <td className="p-2">
                {editingRow === rowIndex ? (
                  <>
                    <button
                      onClick={() => handleSave(rowIndex)}
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
                      setEditingRow(rowIndex);
                      setEditRowData(row);
                    }}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex mt-4 gap-2">
        <span className="bg-gray-200 p-2 rounded-md">{page}</span>
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          className="bg-gray-200 p-2 rounded-md"
        >
          Prev
        </button>
        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          className="bg-gray-200 p-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SmartGrid;
