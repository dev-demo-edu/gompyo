"use client";

import dynamic from "next/dynamic";
import {
  Button,
  TextField,
  Card,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts";
import { BarDataItem, selectDataItem } from "@/types/dashboard-data";
import { useEffect, useState } from "react";
// import { dummyShipmentData } from "@/constants/dummy-data";
import { getPlanData } from "@/actions/plan";
import { IPlanData } from "@/types/grid-col";

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
      <ApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
}

export default function Dashboard() {
  const [filters, setFilters] = useState({
    contracter: "전체보기",
    importer: "전체보기",
    item: "전체보기",
    exchangeRate: 1400,
  });

  const [chartData, setChartData] = useState({
    tonnage: [] as BarDataItem[],
    dollar: [] as BarDataItem[],
    won: [] as BarDataItem[],
  });

  const [totalData, setTotalData] = useState<IPlanData[]>([]);
  const [selectOptions, setSelectOptions] = useState<selectDataItem>({
    contracter: ["전체보기"],
    importer: ["전체보기"],
    item: ["전체보기"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTotalData = await getPlanData();
        setTotalData(fetchedTotalData);

        // 옵션 자동 생성
        setSelectOptions({
          contracter: [
            "전체보기",
            ...new Set(fetchedTotalData.map((data) => data.contractParty)),
          ],
          importer: [
            "전체보기",
            ...new Set(fetchedTotalData.map((data) => data.importer)),
          ],
          item: [
            "전체보기",
            ...new Set(fetchedTotalData.map((data) => data.itemName)),
          ],
        });

        // 초기 데이터로 차트 로드
        filterData(fetchedTotalData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };
    fetchData();
  }, []);

  // DEBUG
  useEffect(() => {
    console.log(totalData);
  }, [totalData]);

  // 필터 변경 핸들러
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 데이터 필터링 함수
  const filterData = (data: IPlanData[] = totalData) => {
    const { contracter, importer, item, exchangeRate } = filters;

    // 날짜 기준 최근 3개월 데이터 필터링
    const monthNames = ["3개월 전", "2개월 전", "1개월 전"];

    const aggregateMonthlyData = (getValue: (item: IPlanData) => number) => {
      return [2, 1, 0].map((monthsAgo, index) => {
        // 특정 월의 시작과 끝 계산
        const now = new Date(2025, 3, 1); // 데이터의 최신 날짜 기준
        const targetMonth = new Date(
          now.getFullYear(),
          now.getMonth() - monthsAgo,
          1,
        );
        const nextMonth = new Date(
          now.getFullYear(),
          now.getMonth() - monthsAgo + 1,
          1,
        );

        // 해당 월의 데이터 필터링 및 집계
        const monthData = data.filter((monthItem) => {
          const itemDate = new Date(monthItem.contractDate);
          return (
            itemDate >= targetMonth &&
            itemDate < nextMonth &&
            (contracter === "전체보기" ||
              monthItem.contractParty === contracter) &&
            (importer === "전체보기" || monthItem.importer === importer) &&
            (item === "전체보기" || monthItem.itemName === item)
          );
        });

        return {
          category: monthNames[index],
          value: monthData.reduce((sum, item) => sum + getValue(item), 0),
        };
      });
    };

    // 차트 데이터 업데이트
    setChartData({
      tonnage: aggregateMonthlyData((item) => item.contractTon),
      dollar: aggregateMonthlyData((item) => item.totalPrice),
      won: aggregateMonthlyData(
        (item) => item.totalPrice * (exchangeRate || 1400),
      ),
    });
  };

  const chartDataTypes = [
    { label: "톤수", unit: "TON (톤)" },
    { label: "달러가격", unit: "DOLLAR (달러)" },
    { label: "원가격", unit: "WON (원)" },
  ];

  return (
    <Stack sx={{ width: "100%", height: "100%", padding: 10 }} spacing={2}>
      <Typography variant="h4" sx={{ marginBottom: 10 }}>
        대시보드
      </Typography>
      <h2 className="font-bold w-[50%]">검색</h2>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        className="w-full md:w-[100%]"
      >
        {/* 계약처 셀렉트 */}
        <FormControl fullWidth>
          <InputLabel>계약처</InputLabel>
          <Select
            value={filters.contracter}
            label="계약처"
            onChange={(e) => handleFilterChange("contracter", e.target.value)}
          >
            {selectOptions.contracter.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 수입처 셀렉트 */}
        <FormControl fullWidth>
          <InputLabel>수입처</InputLabel>
          <Select
            value={filters.importer}
            label="수입처"
            onChange={(e) => handleFilterChange("importer", e.target.value)}
          >
            {selectOptions.importer.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 품목 셀렉트 */}
        <FormControl fullWidth>
          <InputLabel>품목</InputLabel>
          <Select
            value={filters.item}
            label="품목"
            onChange={(e) => handleFilterChange("item", e.target.value)}
          >
            {selectOptions.item.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 환율 입력 */}
        <TextField
          label="환율 입력"
          type="number"
          value={filters.exchangeRate ?? ""}
          onChange={(e) =>
            handleFilterChange("exchangeRate", Number(e.target.value))
          }
          className="w-full"
        />

        <Button
          className="w-[50%] flex items-center p-2"
          variant="contained"
          onClick={() => filterData()}
        >
          적용하기
        </Button>
      </Stack>

      {[
        { title: "톤 통계", type: "tonnage", index: 0 },
        { title: "달러가격 통계", type: "dollar", index: 1 },
        { title: "원가격 통계", type: "won", index: 2 },
      ].map(({ title, type, index }) => (
        <Card key={type} sx={{ width: "100%", height: "100%", padding: 5 }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {title}
          </Typography>
          <BarChart
            propName={chartDataTypes[index].label}
            propData={chartData[type as keyof typeof chartData]}
            propUnit={chartDataTypes[index].unit}
          />
        </Card>
      ))}
    </Stack>
  );
}
