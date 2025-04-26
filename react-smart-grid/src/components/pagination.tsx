import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  mode: "light" | "dark";
  clientPageSize: number;
  onPageChange: (page: number) => void;
  setClientPageSize: (size: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  mode,
  clientPageSize,
  onPageChange,
  setClientPageSize,
}) => {
  return (
    <div className="flex justify-between gap-4 items-center  mt-4 text-black">
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className={`px-1 py-1 text-xs  rounded disabled:opacity-50 ${
            mode === "light" ? "bg-gray-200" : "bg-gray-400"
          }`}
        >
          First
        </button>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-2 rounded disabled:opacity-50"
        >
          <ArrowLeft size={16} color={mode === "light" ? "black" : "white"} />
        </button>
        <span
          className={`${mode === "light" ? "text-gray-700" : "text-gray-300"}`}
        >
          {page}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-1 py-2 rounded  disabled:opacity-50"
        >
          <ArrowRight size={16} color={mode === "light" ? "black" : "white"} />
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-1 py-1 text-xs  rounded disabled:opacity-50 ${
            mode === "light" ? "bg-slate-400 text-white" : "bg-gray-400"
          }`}
        >
          Last
        </button>
      </div>

      <div className="flex  lg:gap-1 gap-0.5">
        <span
          className={`${
            mode === "light" ? "text-gray-700" : "text-gray-300"
          } lg:px-2 lg:mt-1  font-bold ml-4`}
        >
          {"Rows per page "}
        </span>
        <input
          type="number"
          min={1}
          value={clientPageSize}
          onChange={(e) =>
            setClientPageSize(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-12 lg:w-16  px-1 py-1 border rounded text-black"
        />
      </div>
    </div>
  );
};
export default Pagination;
