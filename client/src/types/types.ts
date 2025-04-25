export interface Column<T> {
  id: keyof T & string;
  label: string;
  sortable?: boolean;
  cellRenderer?: (value: any, row: T) => React.ReactNode;
  groupBy?: boolean;
}

export interface GroupedData<T> {
  key: string;
  items: T[];
  isExpanded?: boolean;
}

export interface SmartGridProps<T> {
  data: T[];
  columns: Column<T>[];
  theme?: "light" | "dark";
  pageSize?: number;
  onRowEdit?: (row: T, index: number) => void;
  height?: string | number;
  width?: string | number;
  expandableRows?: boolean;
  renderExpandedContent?: (row: T) => React.ReactNode;
}

export interface FilterState {
  [key: string]: string;
}

export type SortDirection = "asc" | "des";
export type ThemeMode = "light" | "dark";
