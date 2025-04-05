"use client";

import { Card, Stack, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BarDataItem } from "@/types/dashboard-data";
import {
  searchBarChartDataGroupingByCompany,
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
        formatter: (val: number) => `₩${val.toLocaleString()}`,
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
  const [companyChartData, setCompanyChartData] = useState<
    BarDataItem[] | null
  >(null);
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
        const companyResult = await searchBarChartDataGroupingByCompany(
          year,
          month,
        );
        const itemResult = await searchBarChartDataGroupingByItems(year, month);
        const contractPartyResult =
          await searchBarChartDataGroupingByContractParty(year, month);
        const importerResult = await searchBarChartDataGroupingByImporter(
          year,
          month,
        );
        setCompanyChartData(companyResult);
        setItemChartData(itemResult);
        setContractPartyChartData(contractPartyResult);
        setImporterChartData(importerResult);
        console.log("companyChartData", companyResult);
        console.log("itemChartData", itemResult);
        console.log("contractPartyResult", contractPartyResult);
        console.log("importerResult", importerResult);
      } catch (error) {
        console.error("차트 데이터 불러오기 실패:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Stack sx={{ width: "100%", height: "100%", padding: 10 }} spacing={2}>
      <Typography variant="h4" sx={{ marginBottom: 5 }}>
        대시보드
      </Typography>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          사별 통계
        </Typography>
        <BarChart
          propName={"사별 계약 톤수"}
          propData={companyChartData}
          propUnit="TON (톤)"
        />
      </Card>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          품목별 통계
        </Typography>
        <BarChart
          propName={"품목별 톤수"}
          propData={itemChartData}
          propUnit="TON (톤)"
        />
      </Card>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          계약자별 통계
        </Typography>
        <BarChart
          propName={"계약자별 톤수"}
          propData={contractPartyChartData}
          propUnit="TON (톤)"
        />
      </Card>
      <Card sx={{ width: "100%", height: "100%", padding: 5 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          수입처별 통계
        </Typography>
        <BarChart
          propName={"수입처별 톤수"}
          propData={importerChartData}
          propUnit="TON (톤)"
        />
      </Card>
    </Stack>
  );
}
