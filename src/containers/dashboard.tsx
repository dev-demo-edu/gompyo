"use client";

import {
  Button,
  ButtonGroup,
  TextField,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BarDataItem } from "@/types/dashboard-data";
import {
  searchBarChartDataGroupingByContractParty,
  searchBarChartDataGroupingByImporter,
  searchBarChartDataGroupingByItems,
} from "@/actions/dashboard";
import { useEffect, useState } from "react";

function BarChart({
  propName,
  propData,
  propUnit,
}: {
  propName: string;
  propData: BarDataItem[] | null;
  propUnit: string;
}) {
  const series = [
    {
      name: propName,
      data: propData?.map((item) => item.value) ?? [],
    },
  ];

  const categories = propData?.map((item) => item.category) ?? [];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    colors: ["#43BD9D"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: propUnit,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()}`,
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default function Dashboard() {
  // 차트 데이터 종류 관리
  const [chartType, setChartType] = useState("톤");

  const chartDataTypes = [
    [
      { label: "품목별 톤수", unit: "TON (톤)" },
      { label: "계약자별 톤수", unit: "TON (톤)" },
      { label: "수입처별 톤수", unit: "TON (톤)" },
    ],
    [
      { label: "품목별 달러", unit: "$ (달러)" },
      { label: "계약자별 달러", unit: "$ (달러)" },
      { label: "수입처별 달러", unit: "$ (달러)" },
    ],
    [
      { label: "품목별 원", unit: "₩ (원)" },
      { label: "계약자별 원", unit: "₩ (원)" },
      { label: "수입처별 원", unit: "₩ (원)" },
    ],
  ];

  const chartTypeIndexMap: { [key: string]: number } = {
    톤: 0,
    달러: 1,
    원: 2,
  };

  const selectedChartData = chartDataTypes[chartTypeIndexMap[chartType]];

  // 환율 상태 관리
  const [exchangeRate, setExchangeRate] = useState<number | null>(1400);

  // 차트 데이터 상태 관리
  const [itemChartData, setItemChartData] = useState<BarDataItem[] | null>(
    null,
  );
  const [contractPartyChartData, setContractPartyChartData] = useState<
    BarDataItem[] | null
  >(null);
  const [importerChartData, setImporterChartData] = useState<
    BarDataItem[] | null
  >(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const year = new Date().getFullYear().toString();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");

      try {
        const itemResult = await searchBarChartDataGroupingByItems(
          year,
          month,
          chartType,
        );
        const contractPartyResult =
          await searchBarChartDataGroupingByContractParty(
            year,
            month,
            chartType,
          );
        const importerResult = await searchBarChartDataGroupingByImporter(
          year,
          month,
          chartType,
        );
        setItemChartData(applyExchangeRate(itemResult));
        setContractPartyChartData(applyExchangeRate(contractPartyResult));
        setImporterChartData(applyExchangeRate(importerResult));
      } catch (error) {
        console.error("차트 데이터 불러오기 실패:", error);
      }
    };

    fetchChartData();
  }, [chartType, exchangeRate]);

  const applyExchangeRate = (data: BarDataItem[] | null) => {
    if (!data || chartType !== "원" || !exchangeRate) return data;
    return data.map((item) => ({
      ...item,
      value: item.value != null ? item.value * exchangeRate : 0,
    }));
  };

  return (
    <Stack sx={{ width: "100%", height: "100%", padding: 10 }} spacing={2}>
      <Typography variant="h4" sx={{ marginBottom: 5 }}>
        대시보드
      </Typography>
      <Stack direction="row" spacing={2}>
        <ButtonGroup variant="contained" sx={{ height: 35 }}>
          <Button
            onClick={() => setChartType("톤")}
            color={chartType === "톤" ? "primary" : "inherit"}
          >
            톤
          </Button>
          <Button
            onClick={() => setChartType("달러")}
            color={chartType === "달러" ? "primary" : "inherit"}
          >
            달러
          </Button>
          <Button
            onClick={() => setChartType("원")}
            color={chartType === "원" ? "primary" : "inherit"}
          >
            원
          </Button>
        </ButtonGroup>
      </Stack>
      {chartType === "원" && (
        <TextField
          label="환율 입력"
          type="number"
          value={exchangeRate ?? ""}
          onChange={(e) => setExchangeRate(Number(e.target.value))}
          sx={{ width: 200, height: 100 }}
        />
      )}
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          품목별 통계 {"(" + chartType + ")"}
        </Typography>
        <BarChart
          propName={selectedChartData[0].label}
          propData={itemChartData}
          propUnit={selectedChartData[0].unit}
        />
      </Card>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          계약자별 통계 {"(" + chartType + ")"}
        </Typography>
        <BarChart
          propName={selectedChartData[1].label}
          propData={contractPartyChartData}
          propUnit={selectedChartData[1].unit}
        />
      </Card>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          수입처별 통계 {"(" + chartType + ")"}
        </Typography>
        <BarChart
          propName={selectedChartData[2].label}
          propData={importerChartData}
          propUnit={selectedChartData[2].unit}
        />
      </Card>
    </Stack>
  );
}
