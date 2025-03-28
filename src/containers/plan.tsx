"use client";

import Button from "@mui/material/Button";
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
import { useState, useRef, ChangeEvent } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlan } from "@/actions/plan";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

// 계약 정보 스키마
export const contractSchema = z.object({
  contractNumber: z.string().min(1, "계약 번호를 입력해주세요."),
  contractDate: z
    .string()
    .min(1, "계약 일자를 선택해주세요.")
    .default(new Date().toISOString().split("T")[0]),
  contractParty: z.string().min(1, "공급업체를 입력해주세요."),
  incoterms: z.string().optional(),
  importer: z.string().min(1, "수입처를 입력해주세요."),
  estimatedTimeArrival: z.string().optional(),
  estimatedTimeDeparture: z.string().optional(),
  arrivalPort: z.string().optional(),
  departurePort: z.string().optional(),
});

// 화물 정보 스키마
export const cargoSchema = z.object({
  itemName: z.string().min(1, "품목을 입력해주세요."),
  itemVariety: z.string().min(1, "품종을 입력해주세요."),
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
  customTaxAmount: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  customsFee: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  inspectionFee: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  doCharge: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  otherCosts: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  supplyPrice: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  shippingCost: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  laborCost: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  transportStorageFee: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  loadingUnloadingFee: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요")
    .default(0),
  sellingPrice: z.coerce
    .number({
      message: "숫자를 입력해주세요",
    })
    .min(0, "0 이상의 숫자를 입력해주세요"),
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

export default function Plan() {
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

  const {
    register: registerContract,
    handleSubmit: handleContractSubmit,
    formState: { errors: contractErrors },
    reset: resetContract,
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  const {
    register: registerCargo,
    handleSubmit: handleCargoSubmit,
    formState: { errors: cargoErrors },
    reset: resetCargo,
    setValue,
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
  };

  const handleNext = (data: ContractFormData) => {
    setContractData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

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
      const result = await searchItems(query);
      setSearchResults(result.items || []);
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
          slotProps={{
            inputLabel: { shrink: true },
          }}
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="공급업체"
          {...registerContract("contractParty")}
          error={!!contractErrors.contractParty}
          helperText={contractErrors.contractParty?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="수입처"
          {...registerContract("importer")}
          error={!!contractErrors.importer}
          helperText={contractErrors.importer?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

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
            slotProps={{
              inputLabel: { shrink: true },
            }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
          <TextField
            label="ETA"
            type="date"
            {...registerContract("estimatedTimeArrival")}
            error={!!contractErrors.estimatedTimeArrival}
            helperText={contractErrors.estimatedTimeArrival?.message}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
        </Box>
        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            className="h-12 min-w-16 px-4 rounded-lg outline-[1px] outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="h-12 min-w-16 px-4 bg-global-inherit-bgcolor rounded-lg text-global-inherit-color font-bold font-['Public_Sans'] hover:bg-opacity-90"
          >
            다음
          </Button>
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
              label="상품 검색"
              value={searchQuery}
              onChange={handleSearch}
              ref={searchInputRef}
              placeholder="검색어를 입력하세요 (2글자 이상)"
              fullWidth
              className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
            />
            {isSearching && (
              <CircularProgress
                size={20}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              />
            )}
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
                      searchResults.map((item) => (
                        <MenuItem
                          key={item.id}
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
            slotProps={{
              inputLabel: { shrink: true },
            }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="품종"
            {...registerCargo("itemVariety")}
            error={!!cargoErrors.itemVariety}
            helperText={cargoErrors.itemVariety?.message}
            placeholder="입력해주세요."
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="HS CODE"
            {...registerCargo("hsCode")}
            error={!!cargoErrors.hsCode}
            helperText={cargoErrors.hsCode?.message}
            placeholder="입력해주세요."
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
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

          <TextField
            label="포장단위"
            {...registerCargo("packingUnit")}
            error={!!cargoErrors.packingUnit}
            helperText={cargoErrors.packingUnit?.message}
            placeholder="입력해주세요."
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
            }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
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
            label="관세금액"
            type="text"
            {...registerCargo("customTaxAmount")}
            error={!!cargoErrors.customTaxAmount}
            helperText={cargoErrors.customTaxAmount?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="관세수수료"
            type="text"
            {...registerCargo("customsFee")}
            error={!!cargoErrors.customsFee}
            helperText={cargoErrors.customsFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="검사료"
            type="text"
            {...registerCargo("inspectionFee")}
            error={!!cargoErrors.inspectionFee}
            helperText={cargoErrors.inspectionFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="기타비용"
            type="text"
            {...registerCargo("otherCosts")}
            error={!!cargoErrors.otherCosts}
            helperText={cargoErrors.otherCosts?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="매입 수수료"
            type="text"
            {...registerCargo("shippingCost")}
            error={!!cargoErrors.shippingCost}
            helperText={cargoErrors.shippingCost?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
          {/* TODO: 매입 수수율 추가 */}

          <TextField
            label="판매가"
            {...registerCargo("sellingPrice")}
            error={!!cargoErrors.sellingPrice}
            helperText={cargoErrors.sellingPrice?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <Box className="flex flex-col sm:flex-row gap-6 justify-end">
            <Button
              type="button"
              variant="outlined"
              onClick={() => setIsAddingCargo(false)}
              className="h-12 min-w-16 px-4 rounded-lg outline-[1px] outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="h-12 min-w-16 px-4 bg-global-inherit-bgcolor rounded-lg text-global-inherit-color font-bold font-['Public_Sans'] hover:bg-opacity-90"
            >
              추가하기
            </Button>
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
          <Button
            variant="outlined"
            onClick={handleAddCargo}
            className="h-12 min-w-16 px-4 rounded-lg outline-[1px] outline-offset-[-1px] outline-primary-48% outline-opacity-50 text-primary-main font-bold font-['Public_Sans']"
          >
            추가하기
          </Button>
        </Box>

        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <Button
            variant="outlined"
            onClick={handleBack}
            className="h-12 min-w-16 px-4 rounded-lg outline-[1px] outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
          >
            이전
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 min-w-16 px-4 bg-global-inherit-bgcolor rounded-lg text-global-inherit-color font-bold font-['Public_Sans'] hover:bg-opacity-90"
          >
            {isSubmitting ? (
              <Box className="flex items-center gap-2">
                <CircularProgress size={20} color="inherit" />
                <span>등록 중...</span>
              </Box>
            ) : (
              "등록"
            )}
          </Button>
        </Box>
      </Box>
    </>
  );

  return (
    <div className="w-full">
      <Button
        variant="contained"
        onClick={handleOpen}
        className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        추가하기
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
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
