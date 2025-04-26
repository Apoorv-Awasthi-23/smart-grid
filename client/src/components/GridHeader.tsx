import React from "react";
import { Filter } from "lucide-react";
import { GridHeaderProps } from "../types";

const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  sortCol,
  sortDir,
  mode,
  activeFilter,
  filters,
  handleSort,
  toggleFilter,
  handleFilterChange,
}) => {
  return (
    <div className="flex flex-wrap">
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
            <div className="flex items-center w-full">
              <button
                onClick={() => toggleFilter(column.id)}
                className={`p-1 rounded hover:bg-gray-100 ${
                  activeFilter === column.id ? "bg-gray-200" : ""
                }`}
              >
                <Filter size={16} />
              </button>

              <div
                className="flex p-1 cursor-pointer md:w-[30%] "
                onClick={() => column.sortable && handleSort(column.id)}
              >
                {column.label}
                {sortCol === column.id && (sortDir === "asc" ? "↑" : "↓")}
              </div>
            </div>
            {activeFilter === column.id && (
              <div className="mt-2 w-full">
                <input
                  type="text"
                  value={filters[column.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.id, e.target.value)
                  }
                  className={`p-1 rounded-md w-full ${
                    mode === "light"
                      ? "bg-white text-black"
                      : "bg-gray-800 border border-gray-600 text-white"
                  }`}
                  placeholder={`Filter ${column.label}`}
                />
              </div>
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
