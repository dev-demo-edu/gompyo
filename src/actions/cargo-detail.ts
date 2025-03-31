"use server";
import { ContractService } from "@/services/contract.service";
import { PaymentService } from "@/services/payment.service";
import { CostService } from "@/services/cost.service";
import { CargoService } from "@/services/cargo.service";
import { ShipmentService } from "@/services/shipment.service";
import { CostDetailService } from "@/services/cost-detail.service";

const contractService = new ContractService();
const paymentService = new PaymentService();
const costService = new CostService();
const cargoService = new CargoService();
const shipmentService = new ShipmentService();
const costDetailService = new CostDetailService();

type Contract = {
  id: string;
  contractNumber: string | null;
  contractDate: string | null;
  contractParty: string | null;
  importer: string | null;
  incoterms: string | null;
};

type Payment = {
  id: string;
  paymentDueDate: string | null;
  paymentMethod: string;
  contractId: string;
};

type CostDetail = {
  id: string;
  unitPrice: number | null;
  exchangeRate: number | null;
  customsTaxRate: number | null;
  customTaxAmount: number | null;
  customsFee: number | null;
  inspectionFee: number | null;
  doCharge: number | null;
  otherCosts: number | null;
  costId: string;
};

type ContractAmount = {
  id: string;
  supplyPrice: number | null;
  shippingCost: number | null;
  laborCost: number | null;
  transportStorageFee: number | null;
  loadingUnloadingFee: number | null;
  cargoId: string;
};

type Expense = {
  id: string;
  itemsId: string;
  shipmentId: string;
  containerCount: number | null;
  contractTon: number | null;
  customsClearanceDate: string | null;
  quarantineDate: string | null;
  warehouseEntryDate: string | null;
  progressStatus: string | null;
  sellingPrice: number | null;
  margin: number | null;
  totalProfit: number | null;
};

export type CargoDetailData = {
  contract: Contract;
  payment: Payment;
  costDetail: CostDetail;
  cost: ContractAmount;
  cargo: Expense;
  shipment: Shipment;
};

export type Shipment = {
  id: string;
  contractId: string;
  estimatedTimeArrival: string | null;
  estimatedTimeDeparture: string | null;
  arrivalPort: string | null;
  shippingCompany: string | null;
  departurePort: string | null;
  blNumber: string | null;
  palletOrderDate: string | null;
  palletType: string | null;
};

export async function getCargoDetail(
  cargoId: string,
): Promise<CargoDetailData> {
  try {
    // cargoId로 cargo 정보 조회
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    // shipmentId로 shipment 정보 조회
    const shipment = await shipmentService.findById(cargo.shipmentId);
    if (!shipment) {
      throw new Error("선적 정보를 찾을 수 없습니다.");
    }

    // contractId로 계약 정보 조회
    const contract = await contractService.findById(shipment.contractId);
    if (!contract) {
      throw new Error("계약 정보를 찾을 수 없습니다.");
    }

    // contract.id로 결제 정보 조회
    const payment = await paymentService.findByContractId(contract.id);
    if (!payment) {
      throw new Error("결제 정보를 찾을 수 없습니다.");
    }

    // cargoId로 원가 정보 조회
    const cost = await costService.findByCargoId(cargoId);
    if (!cost) {
      throw new Error("원가 정보를 찾을 수 없습니다.");
    }

    const costDetail = await costDetailService.findByCostId(cost.id);
    if (!costDetail) {
      throw new Error("세부 가격 정보를 찾을 수 없습니다.");
    }

    return {
      contract,
      payment,
      cost,
      costDetail,
      cargo,
      shipment,
    };
  } catch (error) {
    console.error("화물 상세 정보 조회 중 오류 발생:", error);
    throw error;
  }
}

export async function updateCargoDetail(
  cargoId: string,
  updateData: Partial<CargoDetailData>,
) {
  try {
    // 계약 정보 업데이트
    if (updateData.contract) {
      await contractService.update(updateData.contract.id, updateData.contract);
    }

    // 결제 정보 업데이트
    if (updateData.payment) {
      await paymentService.update(updateData.payment.id, updateData.payment);
    }

    // 원가 상세 정보 업데이트
    if (updateData.costDetail) {
      await costDetailService.update(
        updateData.costDetail.id,
        updateData.costDetail,
      );
    }

    // 원가 정보 업데이트
    if (updateData.cost) {
      await costService.update(updateData.cost.id, updateData.cost);
    }

    // 화물 정보 업데이트
    if (updateData.cargo) {
      await cargoService.update(updateData.cargo.id, updateData.cargo);
    }

    // 선적 정보 업데이트
    if (updateData.shipment) {
      await shipmentService.update(updateData.shipment.id, updateData.shipment);
    }

    // 업데이트된 전체 데이터 반환
    return await getCargoDetail(cargoId);
  } catch (error) {
    console.error("화물 상세 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}
