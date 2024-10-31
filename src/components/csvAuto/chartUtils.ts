// utils/chartUtils.ts
import Papa from "papaparse";
import {
  ChartData,
  ScatterData,
  CsvRow,
  FilterState,
  MAX_DISPLAYED_ITEMS,
} from "./types";

export const processChartData = (
  filteredData: CsvRow[],
  chartOptions: { xAxisField: string; yAxisField: string; type: string }
): (ChartData & Partial<ScatterData>)[] => {
  if (
    !chartOptions.xAxisField ||
    !chartOptions.yAxisField ||
    !filteredData.length
  ) {
    return [];
  }

  if (chartOptions.type === "Scatter") {
    const scatterPoints: ScatterData[] = filteredData
      .map((row) => {
        const xValue = row[chartOptions.xAxisField];
        const yValue = row[chartOptions.yAxisField];

        // Handle empty values
        if (
          xValue === undefined ||
          xValue === null ||
          xValue === "" ||
          yValue === undefined ||
          yValue === null ||
          yValue === ""
        ) {
          return null;
        }

        const x = Number(xValue);
        const y = Number(yValue);

        if (!isNaN(x) && !isNaN(y)) {
          return {
            x,
            y,
            originalX: xValue,
            originalY: yValue,
            name: `${xValue}-${yValue}`,
          };
        }
        return null;
      })
      .filter((point): point is ScatterData => point !== null)
      .slice(0, MAX_DISPLAYED_ITEMS);

    return scatterPoints.map((point) => ({
      name: point.name,
      value: point.y,
      x: point.x,
      y: point.y,
      originalX: point.originalX,
      originalY: point.originalY,
    }));
  }

  const aggregatedData = new Map<string, number>();
  let count = 0;

  filteredData.forEach((row) => {
    const xValue = row[chartOptions.xAxisField]?.toString() || "";
    const yValue = row[chartOptions.yAxisField];

    // Skip rows with empty x values
    if (xValue === "") return;

    // Handle empty y values
    const numericYValue =
      yValue === undefined || yValue === null || yValue === ""
        ? 0
        : Number(yValue);

    if (aggregatedData.has(xValue)) {
      if (!isNaN(numericYValue)) {
        aggregatedData.set(
          xValue,
          (aggregatedData.get(xValue) || 0) + numericYValue
        );
      } else {
        aggregatedData.set(xValue, (aggregatedData.get(xValue) || 0) + 1);
      }
    } else if (count < MAX_DISPLAYED_ITEMS) {
      aggregatedData.set(xValue, !isNaN(numericYValue) ? numericYValue : 1);
      count++;
    }
  });

  return Array.from(aggregatedData.entries())
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
};

export const applyFilters = (
  data: CsvRow[],
  activeFilters: FilterState[]
): CsvRow[] => {
  return data.filter((row) => {
    return activeFilters.every((filter) => {
      const value = row[filter.field];
      const filterValue = filter.value;

      // Handle empty values in filtering
      if (value === undefined || value === null || value === "") {
        return filterValue === "";
      }

      switch (filter.operator) {
        case "is equal to":
          return value?.toString() === filterValue;
        case "is not equal to":
          return value?.toString() !== filterValue;
        case "is greater than":
          return !isNaN(Number(value)) && Number(value) > Number(filterValue);
        case "is less than":
          return !isNaN(Number(value)) && Number(value) < Number(filterValue);
        case "contains":
          return value
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        case "starts with":
          return value
            ?.toString()
            .toLowerCase()
            .startsWith(filterValue.toLowerCase());
        case "ends with":
          return value
            ?.toString()
            .toLowerCase()
            .endsWith(filterValue.toLowerCase());
        case "is empty":
          return value === undefined || value === null || value === "";
        case "is not empty":
          return value !== undefined && value !== null && value !== "";
        default:
          return true;
      }
    });
  });
};

export const exportChartAsPNG = (
  chartRef: React.RefObject<HTMLDivElement>,
  title: string
) => {
  if (!chartRef.current) {
    console.log("chartRef.current is null, export aborted.");
    return;
  }

  const svgElement = chartRef.current.querySelector(".recharts-wrapper svg");
  if (!svgElement) {
    console.log("No SVG element found, export aborted.");
    return;
  }

  const svgWidth = (svgElement as SVGSVGElement).width.baseVal.value;
  const svgHeight = (svgElement as SVGSVGElement).height.baseVal.value;
  const svgClone = svgElement.cloneNode(true) as SVGElement;

  const background = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  background.setAttribute("width", String(svgWidth));
  background.setAttribute("height", String(svgHeight));
  background.setAttribute("fill", "white");
  svgClone.insertBefore(background, svgClone.firstChild);

  const svgData = new XMLSerializer().serializeToString(svgClone);
  const canvas = document.createElement("canvas");
  canvas.width = svgWidth * 2;
  canvas.height = svgHeight * 2;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.log("Failed to get canvas context, export aborted.");
    return;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(2, 2);

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    URL.revokeObjectURL(url);
  };

  img.onerror = (error) => {
    console.error("Error loading image:", error);
    URL.revokeObjectURL(url);
  };

  img.src = url;
};

export const exportFilteredData = (
  filteredData: CsvRow[],
  fileName: string
) => {
  // Use Papa.unparse instead of stringify and provide the data in the correct format
  const csv = Papa.unparse({
    fields: Object.keys(filteredData[0] || {}),
    data: filteredData.map((row) => Object.values(row)),
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const exportFileName = fileName.replace(".csv", "_filtered.csv");

  link.href = URL.createObjectURL(blob);
  link.download = exportFileName;
  link.click();
  URL.revokeObjectURL(link.href);
};
