import { useEffect, useMemo, useState } from "react";

type Column <T=any>= {
  id: string;
  label: string;
  sortable?: boolean;
  cellRenderer?: (value:T,row: T) => React.ReactNode;
};

type SmartGridProps<T = any> = {
  columns: Column[];
  data: T[];
  pageSize?: number;
  theme?: "light" | "dark";
  onRowEdit?: (row: T, rowIndex: number) => void;
};

const SmartGrid:React.FC<SmartGridProps> = ({
   data,
  columns,
  pageSize = 2,
  theme = "light",
  onRowEdit,
}) => {

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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: value,
    }));
  }

  const filteredData = useMemo(() => {
    return localData.filter((row) => {
      return columns.every((column) => {
        const filterValue = filters[column.id]?.toLowerCase() || "";
        const cellValue = String(row[column.id]??"").toLowerCase();
        return cellValue.includes(filterValue);
      })
    })
  },[localData, filters, columns])

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
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortCol as keyof typeof a];
      const bValue = b[sortCol as keyof typeof b];
      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortCol, sortDir]);


  const paginatedData = sortedData?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil((localData?.length || 0) / pageSize);

  const handleSave = (rowIndex: number) => {
    const updatedRow = { ...localData[rowIndex], ...editRowData };
    const updatedData = [...localData];
    updatedData[rowIndex] = updatedRow;

    setLocalData(updatedData);
    setEditingRow(null);
    setEditRowData({});

    if (onRowEdit) {
      onRowEdit(updatedRow, rowIndex);
    }
  };

  const convertToCSV = () => {
    const csvRows = [];   
    const headers = columns.map((column) => column.label).join(",");
    csvRows.push(headers);

    localData.forEach((row) => {
      const values = columns.map((column) => row[column.id]).join(",");
      csvRows.push(values);
    });

    return csvRows.join("\n");
  }

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }; 


  return (
    <div
      className={`${
        mode === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            if (mode === "light") setMode("dark");
            else setMode("light");
          }}
        >
          {mode === "light" ? (
            <span className="bg-gray-200 p-2 rounded-md">Dark</span>
          ) : (
            <span className="bg-gray-800 p-2 rounded-md">Light</span>
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const csv = convertToCSV();
              downloadFile("smartgrid_export.csv", csv, "text/csv");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >Export CSV</button>
          <button
            onClick={() => {
              // Optionally: include export-safe values instead of full data
              const json = JSON.stringify(localData, null, 2);
              downloadFile("smartgrid_export.json", json, "application/json");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Export JSON
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns?.map((column: Column) => (
              <th
                key={column.id}
                className="p-2"
                onClick={() => {
                  if (column.sortable) handleSort(column.id);
                }}
              >
                {column.label}
                {sortCol === column.id && (sortDir === "asc" ? " ↑" : " ↓")}
                <input
                  type="text"
                  value={filters[column.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.id, e.target.value)
                  }
                  className={`${
                    mode === "light"
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white"
                  } p-1 rounded-md`}
                  placeholder={`Filter ${column.label}`}
                ></input>
              </th>
            ))}
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
                      className={`${
                        mode === "light"
                          ? "bg-white text-black"
                          : "bg-gray-800 text-white"
                      } p-1 rounded-md`}
                    ></input>
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
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() => handleSave(rowIndex)}
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => {
                        setEditingRow(null);
                        setEditRowData({});
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => {
                      setEditingRow(rowIndex);
                      setEditRowData(row);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex  mt-4 gap-2">
        <span className="bg-gray-200 p-2 rounded-md"> {page} </span>
        <button
          onClick={() => {
            if (page === 1) return;
            setPage(page - 1);
          }}
          className="bg-gray-200 p-2 rounded-md"
        >
          Prev
        </button>
        <button
          onClick={() => {
            if (page === totalPages) return;
            setPage(page + 1);
          }}
          className="bg-gray-200 p-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SmartGrid;
