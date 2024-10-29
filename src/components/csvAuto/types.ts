// types.ts
export interface ChartData {
    name: string;
    value: number;
  }
  
  export interface CsvRow {
    [key: string]: string | number;
  }
  
  export interface ChartOptions {
    title: string;
    colors: { [key: string]: string };
    type: string;
    xAxisField: string;
    yAxisField: string;
  }
  
  export interface FilterState {
    id: string;
    field: string;
    operator: string;
    value: string;
  }
  
  export interface ScatterData {
    x: number;
    y: number;
    originalX: string | number;
    originalY: string | number;
    name: string;
  }
  
  export const CHART_TYPES = ["Pie", "Bar", "Line", "Scatter"] as const;
  
  export const FILTER_OPERATORS = [
    { value: "is equal to", label: "Is Equal To" },
    { value: "is not equal to", label: "Is Not Equal To" },
    { value: "is greater than", label: "Is Greater Than" },
    { value: "is less than", label: "Is Less Than" },
    { value: "contains", label: "Contains" },
    { value: "starts with", label: "Starts With" },
    { value: "ends with", label: "Ends With" },
  ] as const;
  
  export const ITEMS_PER_PAGE = 10;
  export const MAX_DISPLAYED_ITEMS = 50;