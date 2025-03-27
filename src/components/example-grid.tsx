// https://www.ag-grid.com/react-data-grid/deep-dive/

"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

import type {
  ColDef,
  RowSelectionOptions,
  ValueFormatterParams,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import type { CustomCellRendererProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Cell Renderer (Display flags based on cell value)
const CompanyLogoRenderer = (params: CustomCellRendererProps) => (
  <span className="flex h-full w-full items-center">
    {params.value && (
      <Image
        alt={`${params} Flag`}
        src={`https://www.ag-grid.com/example-assets/space-company-logos/${params.value.toLowerCase()}.png`}
        className="block w-6 h-auto max-h-1/2 mr-3 filter brightness-110"
        width={48}
        height={29}
      />
    )}
    <p className="text-ellipsis overflow-hidden whitespace-nowrap">
      {params.value}
    </p>
  </span>
);

const StateRenderer = (params: CustomCellRendererProps) => {
  return (
    <span className="flex h-full w-full items-center justify-center">
      {params && (
        <Image
          alt={`${params.value} Flag`}
          src={`https://www.ag-grid.com/example-assets/icons/${params.value ? "tick" : "cross"}-in-circle.png`}
          width={16}
          height={16}
        />
      )}
    </span>
  );
};

const dateFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Date(params.value).toLocaleDateString("ko-KR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
};

interface IRow {
  mission: string;
  company: string;
  location: string;
  date: string;
  time: string;
  rocket: string;
  price: number;
  successful: boolean;
}

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  headerCheckbox: false,
};

export function GridExample() {
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/space-mission-data.json") // Fetch data from server
      .then((result) => result.json()) // Convert to JSON
      .then((rowData) => setRowData(rowData)); // Update state of `rowData`
  }, []);

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      editable: true,
    }),
    [],
  );

  const [rowData, setRowData] = useState<IRow[]>([]);
  /* [
    {
      mission: "CRS SpX-25",
      company: "SpaceX",
      location: "LC-39A, Kennedy Space Center, Florida, USA",
      date: "2022-07-15",
      time: "0:44:00",
      rocket: "Falcon 9 Block 5",
      price: 12480000,
      successful: true,
    },
    ...
  ]; */
  const [colDefs] = useState<ColDef[]>([
    { field: "mission", width: 150 },
    { field: "company", width: 130, cellRenderer: CompanyLogoRenderer },
    { field: "location", width: 225 },
    {
      field: "date",
      valueFormatter: dateFormatter,
    },
    {
      field: "price",
      width: 130,
      valueFormatter: (params: ValueFormatterParams) => {
        return "$" + params.value.toLocaleString();
      },
    },
    { field: "successful", width: 100, cellRenderer: StateRenderer },
    { field: "rocket" },
  ]);

  const onCellValueChanged = (event: object) => {
    console.log(event);
  };
  const onSelectionChanged = (event: object) => {
    console.log(event);
  };

  return (
    // Data Grid will fill the size of the parent container
    <div className="w-full h-full">
      {/* The AG Grid component, with Row Data & Column Definition props */}
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        onCellValueChanged={onCellValueChanged}
        rowSelection={rowSelection}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}
