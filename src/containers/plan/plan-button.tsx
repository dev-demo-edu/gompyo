"use client";

import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlan } from "@/actions/plan";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { searchItemsByName } from "@/actions/item";
import {
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useSetAtom } from "jotai";
import { cargoRefreshAtom } from "@/states/plan";
import { getAllImporters, createImporter } from "@/actions/importer";
import type { Importer } from "@/types/importer";
import { CalculationType } from "@/types/importer";
import CommonButton from "@/components/common-button";

// 계약 정보 스키마
export const contractSchema = z.object({
  contractNumber: z.string().optional(),
  contractDate: z
    .string()
    .min(1, "계약 일자를 선택해주세요.")
    .default(new Date().toISOString().split("T")[0]),
  exporter: z.string().min(1, "공급업체를 입력해주세요."),
  incoterms: z.string().optional(),
  importer: z.string().min(1, "수입회사를 입력해주세요."),
  estimatedTimeArrival: z.string().optional(),
  estimatedTimeDeparture: z.string().optional(),
  arrivalPort: z.string().optional(),
  departurePort: z.string().optional(),
});

// 화물 정보 스키마
export const cargoSchema = z.object({
  itemName: z.string().min(1, "품목을 입력해주세요."),
  itemVariety: z.string().optional(),
  hsCode: z.string().optional(),
  contractTon: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요"),
  packingUnit: z.string().min(1, "포장단위를 입력해주세요."),
  unitPrice: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요"),
  exchangeRate: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(1),
  customsTaxRate: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  purchaseFeeRate: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
});

type ContractFormData = z.infer<typeof contractSchema>;
type CargoFormData = z.infer<typeof cargoSchema>;

interface SearchItem {
  id: string;
  itemName: string | null;
  itemVariety: string | null;
  hsCode?: string | null;
  packingUnit?: string | null;
}

export default function PlanButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [cargoItems, setCargoItems] = useState<CargoFormData[]>([]);
  const [isAddingCargo, setIsAddingCargo] = useState(false);
  const [contractData, setContractData] = useState<ContractFormData | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 수입업체 관련 상태 변수
  const [importers, setImporters] = useState<Importer[]>([]);
  const [isLoadingImporters, setIsLoadingImporters] = useState(false);
  const [showAddImporterInput, setShowAddImporterInput] = useState(false);
  const [newImporterName, setNewImporterName] = useState("");
  const [isCreatingImporter, setIsCreatingImporter] = useState(false);

  const {
    register: registerContract,
    handleSubmit: handleContractSubmit,
    formState: { errors: contractErrors },
    reset: resetContract,
    setValue: setContractValue,
    watch: watchContract,
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  // 수입업체 선택값 감시
  const selectedImporter = watchContract("importer");

  // 컴포넌트 마운트 시 수입업체 목록 로드
  useEffect(() => {
    const fetchImporters = async () => {
      setIsLoadingImporters(true);
      try {
        const importerList = await getAllImporters();
        setImporters(importerList);
      } catch (error) {
        console.error("수입회사 목록 불러오기 실패:", error);
      } finally {
        setIsLoadingImporters(false);
      }
    };

    fetchImporters();
  }, []);

  const {
    register: registerCargo,
    handleSubmit: handleCargoSubmit,
    formState: { errors: cargoErrors },
    reset: resetCargo,
    setValue,
    watch,
  } = useForm<CargoFormData>({
    resolver: zodResolver(cargoSchema),
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setIsAddingCargo(false);
    resetContract();
    resetCargo();
    setCargoItems([]);
    setIsSubmitting(false);
    // 수입업체 관련 상태 초기화
    setShowAddImporterInput(false);
    setNewImporterName("");
  };

  const handleNext = (data: ContractFormData) => {
    setContractData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const setRefresh = useSetAtom(cargoRefreshAtom);

  const handleSubmit = async () => {
    if (!contractData) {
      alert("계약 정보를 입력해주세요.");
      return;
    }

    if (cargoItems.length === 0) {
      alert("화물 정보를 추가해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("제출할 데이터:", { contractData, cargoItems });
      const result = await createPlan(contractData, cargoItems);
      if (result.success) {
        setRefresh((prev) => prev + 1);
        handleClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("계획 저장 중 오류 발생:", error);
      alert("계획 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCargo = () => {
    setIsAddingCargo(true);
  };

  const handleSaveCargo = (data: CargoFormData) => {
    console.log("저장할 화물 데이터:", data);
    setCargoItems((prev) => [...prev, data]);
    setIsAddingCargo(false);
    resetCargo();
  };

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setAnchorEl(event.currentTarget);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchItemsByName(query);
      setSearchResults(result || []);
    } catch (error) {
      console.error("검색 오류:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleItemSelect = (item: SearchItem) => {
    // 폼 필드 채우기
    setValue("itemName", item.itemName || "");
    setValue("itemVariety", item.itemVariety || "");
    setValue("hsCode", item.hsCode || "");
    setValue("packingUnit", item.packingUnit || "");

    // Input 라벨 변경을 위한 트리거
    document.querySelectorAll("input").forEach((input) => {
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    });

    // 검색 상태 초기화
    setSearchQuery("");
    setSearchResults([]);
    setAnchorEl(null);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  // 새 수입업체 생성
  const handleCreateImporter = async () => {
    if (!newImporterName.trim()) {
      return;
    }

    setIsCreatingImporter(true);
    try {
      const newImporter = await createImporter(
        newImporterName.trim(),
        CalculationType.STANDARD,
      );

      if (newImporter) {
        setImporters((prev) => [...prev, newImporter]);
        setContractValue("importer", newImporter.id);
        setNewImporterName("");
        setShowAddImporterInput(false);
      }
    } catch (error) {
      console.error("수입회사 생성 실패:", error);
    } finally {
      setIsCreatingImporter(false);
    }
  };

  const isSearchOpen = Boolean(anchorEl) && searchResults.length > 0;
  const popperId = isSearchOpen ? "item-search-popper" : undefined;

  const renderContractForm = () => (
    <form onSubmit={handleContractSubmit(handleNext)}>
      {/* 헤더 영역 */}
      <Box className="px-6 py-6 border-b border-components-divider border-opacity-20 flex items-center gap-4">
        <Box className="min-w-5 px-1.5 py-0.5 bg-primary-main rounded-[500px] flex justify-center items-center">
          <Typography className="text-xs font-bold text-primary-contrast-text font-['Public_Sans']">
            1
          </Typography>
        </Box>
        <Typography className="text-lg font-semibold text-text-primary font-['Public_Sans'] leading-7">
          계약 정보
        </Typography>
      </Box>

      {/* 바디 영역 */}
      <Box className="p-6 flex flex-col gap-6">
        <TextField
          label="계약 번호"
          {...registerContract("contractNumber")}
          error={!!contractErrors.contractNumber}
          helperText={contractErrors.contractNumber?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="계약 일자"
          type="date"
          {...registerContract("contractDate")}
          error={!!contractErrors.contractDate}
          helperText={contractErrors.contractDate?.message}
          fullWidth
          InputLabelProps={{ shrink: true }}
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="공급업체"
          {...registerContract("exporter")}
          error={!!contractErrors.exporter}
          helperText={contractErrors.exporter?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        {/* 수입회사 필드 */}
        <Box className="flex flex-col gap-2">
          {/* 수입회사 선택 드롭다운 */}
          {!showAddImporterInput ? (
            <FormControl fullWidth error={!!contractErrors.importer}>
              <InputLabel
                id="importer-label"
                shrink
                className="bg-white px-4 text-xs font-semibold text-text-secondary font-['Public_Sans']"
                sx={{
                  px: "4px",
                }}
              >
                수입회사
              </InputLabel>
              <Select
                labelId="importer-label"
                value={selectedImporter || ""}
                {...registerContract("importer")}
                displayEmpty
                className="h-14 rounded-lg"
                startAdornment={
                  isLoadingImporters ? (
                    <CircularProgress size={20} className="mr-2" />
                  ) : null
                }
              >
                <MenuItem value="" disabled>
                  <em>수입회사를 선택해주세요</em>
                </MenuItem>
                {importers.map((importer) => (
                  <MenuItem key={importer.id} value={importer.id}>
                    {importer.importerName}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault(); // 선택 이벤트 방지
                    setShowAddImporterInput(true);
                  }}
                  className="text-primary-main border-t border-gray-100"
                >
                  <AddIcon fontSize="small" className="mr-2" />
                  <span>새 수입회사 추가하기</span>
                </MenuItem>
              </Select>
              {contractErrors.importer && (
                <FormHelperText>
                  {contractErrors.importer.message}
                </FormHelperText>
              )}
            </FormControl>
          ) : (
            /* 새 수입회사 생성 폼 */
            <Box className="flex items-end gap-2">
              <TextField
                label="새 수입회사 이름"
                value={newImporterName}
                onChange={(e) => setNewImporterName(e.target.value)}
                error={isCreatingImporter && !newImporterName.trim()}
                helperText={
                  isCreatingImporter && !newImporterName.trim()
                    ? "수입회사 이름을 입력해주세요."
                    : ""
                }
                fullWidth
                className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
              />
              <Box className="flex gap-2">
                <CommonButton
                  variant="outline"
                  className="h-14"
                  onClick={() => setShowAddImporterInput(false)}
                >
                  취소
                </CommonButton>

                <CommonButton
                  variant="primary"
                  onClick={handleCreateImporter}
                  className="h-14"
                  disabled={isCreatingImporter || !newImporterName.trim()}
                >
                  추가
                </CommonButton>
              </Box>
            </Box>
          )}
        </Box>

        <TextField
          label="인코텀즈"
          {...registerContract("incoterms")}
          error={!!contractErrors.incoterms}
          helperText={contractErrors.incoterms?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <Box className="flex flex-col sm:flex-row gap-6">
          <TextField
            label="출발항"
            {...registerContract("departurePort")}
            error={!!contractErrors.departurePort}
            helperText={contractErrors.departurePort?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
          <TextField
            label="도착항"
            {...registerContract("arrivalPort")}
            error={!!contractErrors.arrivalPort}
            helperText={contractErrors.arrivalPort?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
        </Box>

        <Box className="flex flex-col sm:flex-row gap-6">
          <TextField
            label="ETD"
            type="date"
            {...registerContract("estimatedTimeDeparture")}
            error={!!contractErrors.estimatedTimeDeparture}
            helperText={contractErrors.estimatedTimeDeparture?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
          <TextField
            label="ETA"
            type="date"
            {...registerContract("estimatedTimeArrival")}
            error={!!contractErrors.estimatedTimeArrival}
            helperText={contractErrors.estimatedTimeArrival?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
        </Box>
        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <CommonButton variant="outline" onClick={handleClose}>
            취소
          </CommonButton>

          <CommonButton variant="primary" type="submit">
            다음
          </CommonButton>
        </Box>
      </Box>
    </form>
  );

  const renderCargoDetailForm = () => (
    <form onSubmit={handleCargoSubmit(handleSaveCargo)}>
      {/* 화물 상세 정보 */}
      <Box className="w-full bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)]">
        <Box className="px-6 py-6 border-b border-components-divider border-opacity-20">
          <Typography className="text-lg font-semibold text-text-primary font-['Public_Sans'] leading-7">
            화물 상세 정보
          </Typography>
        </Box>
        <Box className="p-6 flex flex-col gap-6">
          <Box className="flex flex-col gap-1 relative">
            <TextField
              InputProps={{
                endAdornment: isSearching ? (
                  <CircularProgress
                    size={20}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  />
                ) : (
                  <InputAdornment position="start" sx={{ marginBottom: 2 }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              label="상품 검색"
              value={searchQuery}
              onChange={handleSearch}
              ref={searchInputRef}
              variant="filled"
              placeholder="검색어를 입력하세요 (2글자 이상)"
              fullWidth
              className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
            />
            <Typography className="text-xs text-text-secondary">
              전에 등록하셨던 상품을 검색해서 자동으로 입력할 수 있습니다
            </Typography>

            <ClickAwayListener onClickAway={handleClickAway}>
              <Popper
                id={popperId}
                open={isSearchOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                className="z-[9999] w-full"
                style={{ width: anchorEl ? anchorEl.clientWidth : "auto" }}
                disablePortal={true}
                modifiers={[
                  {
                    name: "flip",
                    enabled: true,
                  },
                  {
                    name: "preventOverflow",
                    enabled: true,
                    options: {
                      altAxis: true,
                      boundary: "clippingParents",
                    },
                  },
                  {
                    name: "offset",
                    enabled: true,
                    options: {
                      offset: [0, 4],
                    },
                  },
                ]}
              >
                <Paper
                  className="w-full max-h-60 overflow-auto shadow-xl border border-gray-200"
                  style={{
                    position: "relative",
                    zIndex: 9999,
                    backgroundColor: "white",
                  }}
                >
                  <MenuList>
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <MenuItem
                          key={idx}
                          onClick={() => handleItemSelect(item)}
                          className="py-3 px-4 border-b last:border-b-0 border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-primary-main">
                              {item.itemName || ""}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.itemVariety || ""} |{" "}
                              {item.packingUnit || ""}
                            </span>
                          </div>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled className="py-3 px-4 text-gray-500">
                        검색 결과가 없습니다
                      </MenuItem>
                    )}
                  </MenuList>
                </Paper>
              </Popper>
            </ClickAwayListener>
          </Box>

          <TextField
            label="품목"
            {...registerCargo("itemName")}
            error={!!cargoErrors.itemName}
            helperText={cargoErrors.itemName?.message}
            placeholder="입력해주세요."
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="품종"
            {...registerCargo("itemVariety")}
            error={!!cargoErrors.itemVariety}
            helperText={cargoErrors.itemVariety?.message}
            placeholder="입력해주세요."
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="HS CODE"
            {...registerCargo("hsCode")}
            error={!!cargoErrors.hsCode}
            helperText={cargoErrors.hsCode?.message}
            placeholder="입력해주세요."
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="계약톤수"
            type="text"
            {...registerCargo("contractTon")}
            error={!!cargoErrors.contractTon}
            helperText={cargoErrors.contractTon?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <FormControl
            fullWidth
            error={!!cargoErrors.packingUnit}
            sx={{ mb: 1 }}
          >
            <InputLabel id="packing-unit-label">포장단위</InputLabel>
            <Select
              labelId="packing-unit-label"
              value={watch("packingUnit") || ""}
              label="포장단위"
              onChange={(e) =>
                setValue("packingUnit", e.target.value, {
                  shouldValidate: true,
                })
              }
            >
              <MenuItem value="1.2ton">1.2ton</MenuItem>
              <MenuItem value="25kg">25kg</MenuItem>
              <MenuItem value="bulk">bulk</MenuItem>
            </Select>
            {cargoErrors.packingUnit && (
              <Typography color="error" variant="caption">
                {cargoErrors.packingUnit.message}
              </Typography>
            )}
          </FormControl>
        </Box>
      </Box>

      {/* 금액 정보 */}
      <Box className="w-full bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)]">
        <Box className="px-6 py-6 border-b border-components-divider border-opacity-20">
          <Typography className="text-lg font-semibold text-text-primary font-['Public_Sans'] leading-7">
            금액 정보
          </Typography>
        </Box>
        <Box className="p-6 flex flex-col gap-6">
          <TextField
            label="단가"
            type="text"
            {...registerCargo("unitPrice")}
            error={!!cargoErrors.unitPrice}
            helperText={cargoErrors.unitPrice?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="환율"
            type="text"
            {...registerCargo("exchangeRate")}
            error={!!cargoErrors.exchangeRate}
            helperText={cargoErrors.exchangeRate?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="관세율"
            type="text"
            {...registerCargo("customsTaxRate")}
            error={!!cargoErrors.customsTaxRate}
            helperText={cargoErrors.customsTaxRate?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="매입 수수료율"
            type="text"
            {...registerCargo("purchaseFeeRate")}
            error={!!cargoErrors.purchaseFeeRate}
            helperText={cargoErrors.purchaseFeeRate?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <Box className="flex flex-col sm:flex-row gap-6 justify-end">
            <CommonButton
              variant="outline"
              onClick={() => setIsAddingCargo(false)}
            >
              취소
            </CommonButton>

            <CommonButton variant="primary" type="submit">
              추가하기
            </CommonButton>
          </Box>
        </Box>
      </Box>
    </form>
  );

  const renderCargoForm = () => (
    <>
      {/* 헤더 영역 */}
      <Box className="px-6 py-6 border-b border-components-divider border-opacity-20 flex items-center gap-4">
        <Box className="min-w-5 px-1.5 py-0.5 bg-primary-main rounded-[500px] flex justify-center items-center">
          <Typography className="text-xs font-bold text-primary-contrast-text font-['Public_Sans']">
            2
          </Typography>
        </Box>
        <Typography className="text-lg font-semibold text-text-primary font-['Public_Sans'] leading-7">
          화물 정보
        </Typography>
      </Box>

      {/* 바디 영역 */}
      <Box className="p-6 flex flex-col gap-6">
        <TableContainer className="bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)]">
          <Table>
            <TableHead>
              <TableRow className="bg-background-neutral">
                <TableCell className="w-40 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  품목
                </TableCell>
                <TableCell className="w-48 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  품종
                </TableCell>
                <TableCell className="flex-1 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  HS-CODE
                </TableCell>
                <TableCell className="w-24 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  계약톤수
                </TableCell>
                <TableCell className="w-24 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  포장단위
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cargoItems.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-components-divider border-opacity-20"
                >
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.itemName}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.itemVariety}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.hsCode}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.contractTon}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.packingUnit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="flex justify-end">
          <CommonButton variant="outline" onClick={handleAddCargo}>
            추가하기
          </CommonButton>
        </Box>

        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <CommonButton variant="outline" onClick={handleBack}>
            이전
          </CommonButton>

          <CommonButton
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Box className="flex items-center gap-2">
                <CircularProgress size={20} color="inherit" />
                <span>등록 중...</span>
              </Box>
            ) : (
              "등록"
            )}
          </CommonButton>
        </Box>
      </Box>
    </>
  );

  return (
    // 오른쪽 끝으로 설정하기 위해서 flex justify-end 추가
    <div>
      <CommonButton variant="info" onClick={handleOpen}>
        추가하기
      </CommonButton>

      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleClose();
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="flex items-center justify-center p-4"
      >
        <Paper
          elevation={3}
          className="w-full max-w-[712px] bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)] max-h-[90vh] overflow-auto"
        >
          {step === 1
            ? renderContractForm()
            : isAddingCargo
              ? renderCargoDetailForm()
              : renderCargoForm()}
        </Paper>
      </Modal>
    </div>
  );
}
