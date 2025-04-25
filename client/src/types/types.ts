export type Column<T = any> = {
  id: string;
  label: string;
  sortable?: boolean;
  cellRenderer?: (value: T, row: T) => React.ReactNode;
};

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
