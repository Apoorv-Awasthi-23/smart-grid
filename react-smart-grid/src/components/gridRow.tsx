import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RowProps } from "../types";

function Row<T>({
  index,
  style,
  paginatedData,
  columns,
  mode,
  isLoading,
  editingRow,
  setEditingRow,
  handleSave,
}: RowProps<T>) {
  const row = paginatedData[index];
  const isEditing = editingRow === index;
  const [tempRow, setTempRow] = useState(row);

  useEffect(() => {
    if (isEditing && row) {
      setTempRow(row);
    }
  }, [isEditing, row]);

  if (isLoading || !row) {
    return (
      <motion.div
        className="flex animate-pulse gap-4 px-3 py-2"
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {columns.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-5 rounded ${
              mode === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
            style={{ minWidth: `${100 / (columns.length + 1)}%` }}
          />
        ))}
        <div
          className={`h-5 rounded ${
            mode === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
          style={{ minWidth: `${100 / (columns.length + 1)}%` }}
        />
      </motion.div>
    );
  }

  return (
    <div
      className={`flex flex-wrap sm:flex-nowrap w-full ${
        mode === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"
      }`}
      style={style}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 p-3 truncate border-b border-gray-200 min-w-[250px] sm:min-w-0"
          style={{ minWidth: `${100 / (columns.length + 1)}%` }}
        >
          {isEditing ? (
            <input
              type="text"
              value={(tempRow as any)?.[column.id] ?? ""}
              onChange={(e) =>
                setTempRow(
                  (prev) =>
                    ({
                      ...(prev as Partial<T>),
                      [column.id]: e.target.value,
                    } as T)
                )
              }
              className={`p-1 rounded-md w-full ${
                mode === "light"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
            />
          ) : column.cellRenderer ? (
            column.cellRenderer((row as any)?.[column.id], row)
          ) : (
            (row as any)?.[column.id]
          )}
        </div>
      ))}
      <div
        className="p-1 border-b border-gray-200 flex items-left justify-center"
        style={{ minWidth: `${100 / (columns.length + 1)}%` }}
      >
        {isEditing ? (
          <div className="flex flex-row items-center space-x-1">
            <button
              onClick={() => handleSave(index, tempRow)}
              className="px-1 my-1 md:px-2 py-1 rounded text-white bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingRow(null)}
              className="px-1 my-1 md:px-2 py-1 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingRow(index)}
            className="px-3 py-1 my-1 rounded text-white bg-blue-600 xl:mr-36 lg:mr-20"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
export default Row;