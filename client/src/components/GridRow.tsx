import { useState, useEffect } from "react";
import { Column } from "../types/types";

interface GridRowProps<T = any> {
  index: number;
  row: T;
  columns: Column<T>[];
  mode: "light" | "dark";
  editingRow: number | null;
  editRowData: { [key: string]: any };
  onEdit: (index: number, row: T) => void;
  onSave: (index: number) => void;
  onCancel: () => void;
  onEditDataChange: (columnId: string, value: string) => void;
}

const GridRow = <T,>({
  index,
  row,
  columns,
  mode,
  editingRow,
  editRowData,
  onEdit,
  onSave,
  onCancel,
  onEditDataChange,
}: GridRowProps<T>) => {
  // Local state for editing
  const [localEditData, setLocalEditData] = useState<{ [key: string]: any }>(
    {}
  );

  // Initialize local edit data when editing starts
  useEffect(() => {
    if (editingRow === index) {
      // Initialize with current editRowData or row data
      const initialData: { [key: string]: any } = {};
      columns.forEach((column) => {
        initialData[column.id] =
          editRowData[column.id] !== undefined
            ? editRowData[column.id]
            : row[column.id as keyof T];
      });
      setLocalEditData(initialData);
    }
  }, [editingRow, index, row, columns, editRowData]);

  const handleLocalInputChange = (columnId: string, value: string) => {
    setLocalEditData((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // This function syncs local changes with parent before saving
  const handleSave = () => {
    // First update parent's editRowData state with all our local changes
    columns.forEach((column) => {
      if (localEditData[column.id] !== undefined) {
        onEditDataChange(column.id, localEditData[column.id]);
      }
    });

    // Delay the save call slightly to ensure state updates have been processed
    setTimeout(() => {
      onSave(index);
    }, 0);
  };

  return (
    <div
      className={`flex ${
        mode === "light" ? "hover:bg-gray-50" : "hover:bg-gray-700"
      }`}
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
              value={
                localEditData[column.id] !== undefined
                  ? String(localEditData[column.id])
                  : ""
              }
              onChange={(e) =>
                handleLocalInputChange(column.id, e.target.value)
              }
              className={`p-1 rounded-md w-full ${
                mode === "light"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
            />
          ) : column.cellRenderer ? (
            column.cellRenderer(row[column.id as keyof T], row)
          ) : (
            String(row[column.id as keyof T] ?? "")
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
              onClick={handleSave}
              className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => onEdit(index, row)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default GridRow;
