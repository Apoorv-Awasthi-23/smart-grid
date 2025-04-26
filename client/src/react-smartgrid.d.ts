declare module 'react-smart-data-grid' {
  import { FC, ReactNode, CSSProperties } from 'react';

  export interface SmartGridProps {
    columns?: number;
    gap?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
    autoAdjust?: boolean;
    alignTop?: boolean;
    responsive?: {
      [breakpoint: string]: Partial<GridOptions>;
    };
  }

  export interface GridItemProps {
    colSpan?: number;
    className?: string;
    style?: CSSProperties;
    fillHeight?: boolean;
    gridArea?: string;
    children?: ReactNode;
  }

  export interface GridOptions {
    columns?: number;
    gap?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
  }

  export const SmartGrid: FC<SmartGridProps>;
  export const GridItem: FC<GridItemProps>;
  export const useSmartGrid: (options: SmartGridProps) => {
    gridRef: React.RefObject<HTMLDivElement>;
    recalculateLayout: () => void;
    gridState: {
      columns: number;
      itemCount: number;
      containerWidth: number;
    };
  };
}