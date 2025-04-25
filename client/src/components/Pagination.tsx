
interface PaginationProps {
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
    <div className="flex justify-end items-center gap-4 mt-4 text-black">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <span
        className={`${mode === "light" ? "text-gray-700" : "text-gray-300"}`}
      >
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
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
  );
};
export default Pagination;
