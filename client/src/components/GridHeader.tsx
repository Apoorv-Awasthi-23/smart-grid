import { Filter } from "lucide-react";
import { Column } from "../types/types";

interface GridHeaderProps<T> {
  columns: Column<T>[];
  mode: "light" | "dark";
  sortCol: string | null;
  sortDir: "asc" | "des";
  activeFilter: string | null;
  filters: { [key: string]: string };
  onSort: (columnId: string) => void;
  onFilterToggle: (columnId: string) => void;
  onFilterChange: (columnId: string, value: string) => void;
}

const GridHeader = <T,>({
  columns,
  mode,
  sortCol,
  sortDir,
  activeFilter,
  filters,
  onSort,
  onFilterToggle,
  onFilterChange,
}: GridHeaderProps<T>) => {
  return (
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
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => column.sortable && onSort(column.id)}
              >
                {column.label}{" "}
                {sortCol === column.id && (sortDir === "asc" ? "↑" : "↓")}
              </div>
              <button
                onClick={() => onFilterToggle(column.id)}
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
                onChange={(e) => onFilterChange(column.id, e.target.value)}
                className={`mt-2 p-1 rounded-md w-full ${
                  mode === "light"
                    ? "bg-white text-black"
                    : "bg-gray-800 text-white"
                }`}
                placeholder={`Filter ${column.label}`}
              />
            )}
          </div>
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
  );
};

export default GridHeader;
