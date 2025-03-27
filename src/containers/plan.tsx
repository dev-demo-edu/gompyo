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
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlan } from "@/actions/plan";
import { ContractData, CargoItem } from "@/types/plan";

// 계약 정보 스키마
const contractSchema = z.object({
  contractNumber: z.string().min(1, "계약 번호를 입력해주세요."),
  contractDate: z.string().min(1, "계약 일자를 선택해주세요."),
  supplier: z.string().min(1, "공급업체를 입력해주세요."),
  importer: z.string().min(1, "수입처를 입력해주세요."),
  incoterms: z.string().min(1, "인코텀즈를 입력해주세요."),
  eta: z.string().min(1, "ETA를 선택해주세요."),
  etd: z.string().min(1, "ETD를 선택해주세요."),
  arrivalPort: z.string().min(1, "도착항을 입력해주세요."),
  departurePort: z.string().min(1, "출발항을 입력해주세요."),
  vessel: z.string().min(1, "선박명을 입력해주세요."),
  blNumber: z.string().min(1, "B/L 번호를 입력해주세요."),
  containerType: z.string().min(1, "컨테이너 타입을 입력해주세요."),
});

// 화물 정보 스키마
const cargoSchema = z.object({
  sku: z.string().min(1, "SKU를 입력해주세요."),
  item: z.string().min(1, "품목을 입력해주세요."),
  variety: z.string().min(1, "품종을 입력해주세요."),
  hsCode: z.string().min(1, "HS CODE를 입력해주세요."),
  contractTonnage: z.number().min(0, "계약톤수는 0 이상이어야 합니다."),
  packagingUnit: z.string().min(1, "포장단위를 입력해주세요."),
  unitPrice: z.number().min(0, "단가는 0 이상이어야 합니다."),
  exchangeRate: z.number().min(0, "환율은 0 이상이어야 합니다."),
  tariffRate: z.number().min(0, "관세율은 0 이상이어야 합니다."),
  paymentMethod: z.string().min(1, "결제방식을 입력해주세요."),
  remittanceFee: z.number().min(0, "송금수수료는 0 이상이어야 합니다."),
  customsFee: z.number().min(0, "관세수수료는 0 이상이어야 합니다."),
  inspectionFee: z.number().min(0, "검사료는 0 이상이어야 합니다."),
  otherCosts: z.number().min(0, "기타비용은 0 이상이어야 합니다."),
  purchaseFee: z.number().min(0, "매입 수수료는 0 이상이어야 합니다."),
  sellingPrice: z.number().min(0, "판매가는 0 이상이어야 합니다."),
  containerCount: z.number().optional(),
  originCountry: z.string().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;
type CargoFormData = z.infer<typeof cargoSchema>;

export default function Plan() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [isAddingCargo, setIsAddingCargo] = useState(false);
  const [contractData, setContractData] = useState<ContractData | null>(null);

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
  };

  const handleNext = (data: ContractFormData) => {
    setContractData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!contractData) return;

    setIsSubmitting(true);
    try {
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
    setCargoItems((prev) => [...prev, data]);
    setIsAddingCargo(false);
    resetCargo();
  };

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
          {...registerContract("supplier")}
          error={!!contractErrors.supplier}
          helperText={contractErrors.supplier?.message}
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
            {...registerContract("etd")}
            error={!!contractErrors.etd}
            helperText={contractErrors.etd?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
          <TextField
            label="ETA"
            type="date"
            {...registerContract("eta")}
            error={!!contractErrors.eta}
            helperText={contractErrors.eta?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />
        </Box>

        <TextField
          label="선박명"
          {...registerContract("vessel")}
          error={!!contractErrors.vessel}
          helperText={contractErrors.vessel?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="B/L 번호"
          {...registerContract("blNumber")}
          error={!!contractErrors.blNumber}
          helperText={contractErrors.blNumber?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        <TextField
          label="컨테이너 타입"
          {...registerContract("containerType")}
          error={!!contractErrors.containerType}
          helperText={contractErrors.containerType?.message}
          placeholder="입력해주세요."
          fullWidth
          className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
        />

        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            className="h-12 min-w-16 px-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
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
          <Box className="flex flex-col gap-1">
            <TextField
              label="상품 검색"
              {...registerCargo("sku")}
              error={!!cargoErrors.sku}
              helperText={cargoErrors.sku?.message}
              placeholder="입력해주세요."
              fullWidth
              className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
            />
            <Box className="flex items-center gap-1">
              <Typography className="text-xs text-text-secondary">
                전에 등록하셨던 상품을 검색해서 자동으로 입력할 수 있습니다
              </Typography>
            </Box>
          </Box>

          <TextField
            label="품목"
            {...registerCargo("item")}
            error={!!cargoErrors.item}
            helperText={cargoErrors.item?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="품종"
            {...registerCargo("variety")}
            error={!!cargoErrors.variety}
            helperText={cargoErrors.variety?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="HS CODE"
            {...registerCargo("hsCode")}
            error={!!cargoErrors.hsCode}
            helperText={cargoErrors.hsCode?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="계약톤수"
            type="number"
            {...registerCargo("contractTonnage", { valueAsNumber: true })}
            error={!!cargoErrors.contractTonnage}
            helperText={cargoErrors.contractTonnage?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="포장단위"
            {...registerCargo("packagingUnit")}
            error={!!cargoErrors.packagingUnit}
            helperText={cargoErrors.packagingUnit?.message}
            placeholder="입력해주세요."
            fullWidth
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
            type="number"
            {...registerCargo("unitPrice", { valueAsNumber: true })}
            error={!!cargoErrors.unitPrice}
            helperText={cargoErrors.unitPrice?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="환율"
            type="number"
            error={!!cargoErrors.exchangeRate}
            helperText={cargoErrors.exchangeRate?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="관세율"
            type="number"
            {...registerCargo("tariffRate", { valueAsNumber: true })}
            error={!!cargoErrors.tariffRate}
            helperText={cargoErrors.tariffRate?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="결제방식"
            {...registerCargo("paymentMethod")}
            error={!!cargoErrors.paymentMethod}
            helperText={cargoErrors.paymentMethod?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="송금수수료"
            type="number"
            {...registerCargo("remittanceFee", { valueAsNumber: true })}
            error={!!cargoErrors.remittanceFee}
            helperText={cargoErrors.remittanceFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="관세수수료"
            type="number"
            {...registerCargo("customsFee", { valueAsNumber: true })}
            error={!!cargoErrors.customsFee}
            helperText={cargoErrors.customsFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="검사료"
            type="number"
            {...registerCargo("inspectionFee", { valueAsNumber: true })}
            error={!!cargoErrors.inspectionFee}
            helperText={cargoErrors.inspectionFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="기타비용"
            type="number"
            {...registerCargo("otherCosts", { valueAsNumber: true })}
            error={!!cargoErrors.otherCosts}
            helperText={cargoErrors.otherCosts?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="매입 수수료"
            type="number"
            {...registerCargo("purchaseFee", { valueAsNumber: true })}
            error={!!cargoErrors.purchaseFee}
            helperText={cargoErrors.purchaseFee?.message}
            placeholder="입력해주세요."
            fullWidth
            className="[&_.MuiOutlinedInput-root]:h-14 [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiInputLabel-root]:bg-background-paper [&_.MuiInputLabel-root]:px-1 [&_.MuiInputLabel-root]:text-xs [&_.MuiInputLabel-root]:font-semibold [&_.MuiInputLabel-root]:text-text-secondary [&_.MuiInputLabel-root]:font-['Public_Sans']"
          />

          <TextField
            label="판매가"
            type="number"
            {...registerCargo("sellingPrice", { valueAsNumber: true })}
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
              className="h-12 min-w-16 px-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
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
                  SKU
                </TableCell>
                <TableCell className="w-48 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  품목
                </TableCell>
                <TableCell className="flex-1 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  HS-CODE
                </TableCell>
                <TableCell className="w-24 text-text-secondary text-sm font-semibold font-['Public_Sans']">
                  계약톤수
                </TableCell>
                <TableCell className="w-20 text-text-secondary text-sm font-semibold font-['Public_Sans']">
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
                    {item.sku}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.item}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.hsCode}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.contractTonnage}
                  </TableCell>
                  <TableCell className="text-text-primary text-sm font-normal font-['Public_Sans']">
                    {item.packagingUnit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="outlined"
          onClick={handleAddCargo}
          className="h-7 min-w-16 px-2 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-48% outline-opacity-50 text-primary-main text-xs font-bold font-['Public_Sans']"
        >
          추가하기
        </Button>

        {/* 버튼 영역 */}
        <Box className="flex flex-col sm:flex-row gap-6 justify-end">
          <Button
            variant="outlined"
            onClick={handleBack}
            className="h-12 min-w-16 px-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-components-button-outlined outline-opacity-30 text-text-primary font-bold font-['Public_Sans'] hover:bg-gray-50"
          >
            이전
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="h-12 min-w-16 px-4 bg-global-inherit-bgcolor rounded-lg text-global-inherit-color font-bold font-['Public_Sans'] hover:bg-opacity-90"
          >
            등록
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
