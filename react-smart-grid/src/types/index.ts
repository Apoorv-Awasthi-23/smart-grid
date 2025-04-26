export type Column<T = any> = {
  id: string;
  label: string;
  sortable?: boolean;
  cellRenderer?: (value: T, row: T) => React.ReactNode;
};

export type RowProps<T> = {
  index: number;
  style: React.CSSProperties;
  paginatedData: T[];
  columns: Column<T>[];
  mode: "light" | "dark";
  isLoading: boolean;
  editingRow: number | null;
  setEditingRow: (index: number | null) => void;
  handleSave: (rowIndex: number, updatedRow: T) => void;
};
export interface GridHeaderProps {
  columns: any[];
  sortCol: string | null;
  sortDir: "asc" | "des";
  mode: "light" | "dark";
  activeFilter: string | null;
  filters: { [key: string]: string };
  handleSort: (colId: string) => void;
  toggleFilter: (colId: string) => void;
  handleFilterChange: (colId: string, value: string) => void;
}
export interface PaginationProps {
  page: number;
  totalPages: number;
  mode: "light" | "dark";
  clientPageSize: number;
  onPageChange: (page: number) => void;
  setClientPageSize: (size: number) => void;
}
export type SmartGridProps<T = any> = {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  theme?: "light" | "dark";
  onRowEdit?: (row: T, rowIndex: number) => void;
  height?: number;
  width?: number | string;
  onDataChange?: (updatedData: T[]) => void;
};