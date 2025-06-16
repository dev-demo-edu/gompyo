"use client";
import { useEffect, useState, useCallback } from "react";
import QuotationGrid from "./quotation-grid";
import {
  CompanyAddModal,
  CompanyDeleteModal,
  CompanyEditModal,
  ItemAddModal,
  ItemDeleteModal,
  ItemEditModal,
  PriceEditModal,
  QuotationDocumentModal,
} from "./quotation-modal-container";
import { CompanyFormValues } from "./company-form";
import { ItemFormValues } from "./item-form";
import { Stack, Tab, Tabs, useMediaQuery } from "@mui/material";
import {
  updateQuotationCellAction,
  addQuotationCompanyAction,
  addQuotationItemAction,
  deleteQuotationCompanyAction,
  deleteQuotationItemAction,
  getDomesticAction,
  getForeignerAction,
  generateQuotationPDF,
  updateCompanyAction,
  updateItemAction,
} from "@/actions/quotation";
import { QuotationCompany, QuotationItem } from "@/services/quotation-service";
import { nanoid } from "nanoid";
import { CellValueChangedEvent } from "ag-grid-community";
import CommonButton from "@/components/common-button";
import { getUserQuotationColumnOrder, ColumnOrder } from "@/actions/user";
import { defaultQuotationColumnOrderFields } from "@/constants/column";
import QuotationMobileView from "./quotation-mobile-view";

// 문서 번호 생성 함수 추가
const generateDocumentNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `GP${year}${month}${day}${randomNum}`;
};

export interface ColumnCompany extends QuotationCompany {
  companyColumnName: string;
}

export default function QuotationContainer() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 모달 상태 관리
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyEditModalOpen, setCompanyEditModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemEditModalOpen, setItemEditModalOpen] = useState(false);
  const [companyDeleteModalOpen, setCompanyDeleteModalOpen] = useState(false);
  const [itemDeleteModalOpen, setItemDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ColumnCompany | null>(
    null,
  );
  const [quotationDocumentModalOpen, setQuotationDocumentModalOpen] =
    useState(false);
  const [mobilePriceEditModalOpen, setMobilePriceEditModalOpen] =
    useState(false);
  const [selectedItemForPriceEdit, setSelectedItemForPriceEdit] = useState<{
    itemId: string;
    itemName: string;
    currentPrice: number;
  } | null>(null);

  // 컬럼 순서 상태 추가
  const [columnOrder, setColumnOrder] = useState<ColumnOrder[]>([]);

  // 데스크톱 전용 선택 상태 관리
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [selectedColumnsForManagement, setSelectedColumnsForManagement] =
    useState<Record<string, boolean>>({});

  // 모바일 전용 선택 상태 관리 추가
  const [mobileSelectedCompany, setMobileSelectedCompany] =
    useState<ColumnCompany | null>(null);
  const [mobileSelectedColumns, setMobileSelectedColumns] = useState<
    Record<string, boolean>
  >({});
  const [
    mobileSelectedColumnsForManagement,
    setMobileSelectedColumnsForManagement,
  ] = useState<Record<string, boolean>>({});

  // 컬럼 순서 로딩
  useEffect(() => {
    const loadColumnOrder = async () => {
      try {
        const userColumnOrder = await getUserQuotationColumnOrder();
        setColumnOrder(userColumnOrder || defaultQuotationColumnOrderFields);
      } catch (error) {
        console.error("컬럼 순서 로딩 오류:", error);
        setColumnOrder(defaultQuotationColumnOrderFields);
      }
    };
    loadColumnOrder();
  }, []);

  // 컬럼 순서 변경 핸들러
  const handleColumnOrderChange = useCallback((newOrder: ColumnOrder[]) => {
    setColumnOrder(newOrder);
  }, []);

  // 데이터 상태 관리
  const [domesticItems, setDomesticItems] = useState<QuotationItem[]>([]);
  const [domesticCompanies, setDomesticCompanies] = useState<ColumnCompany[]>(
    [],
  );
  const [domesticPriceData, setDomesticPriceData] = useState<
    Record<string, Record<string, number>>
  >({});
  const [overseasItems, setOverseasItems] = useState<QuotationItem[]>([]);
  const [overseasCompanies, setOverseasCompanies] = useState<ColumnCompany[]>(
    [],
  );
  const [overseasPriceData, setOverseasPriceData] = useState<
    Record<string, Record<string, number>>
  >({});
  const [tab, setTab] = useState<"domestic" | "overseas">("domestic");

  const items = tab === "domestic" ? domesticItems : overseasItems;
  const companies = tab === "domestic" ? domesticCompanies : overseasCompanies;
  const priceData = tab === "domestic" ? domesticPriceData : overseasPriceData;
  const setItems = tab === "domestic" ? setDomesticItems : setOverseasItems;
  const setCompanies =
    tab === "domestic" ? setDomesticCompanies : setOverseasCompanies;
  const setPriceData =
    tab === "domestic" ? setDomesticPriceData : setOverseasPriceData;

  useEffect(() => {
    // 모바일에서 데스크톱으로 전환 시 선택 상태 초기화
    if (!isMobile) {
      setMobileSelectedCompany(null);
      setMobileSelectedColumns({});
      setMobileSelectedColumnsForManagement({});
    } else {
      // 데스크톱에서 모바일로 전환 시 데스크톱 선택 상태 초기화
      setSelectedCompany(null);
      setSelectedRows({});
      setSelectedColumns({});
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      const domesticData = await getDomesticAction();
      setDomesticItems(domesticData.items);
      setDomesticCompanies(
        domesticData.companies.map((company) => ({
          ...company,
          companyColumnName: transformCompanyName(
            company.companyName,
            company.priceType,
          ),
        })),
      );
      setDomesticPriceData(domesticData.priceData);
      const overseasData = await getForeignerAction();
      setOverseasItems(overseasData.items);
      setOverseasCompanies(
        overseasData.companies.map((company) => ({
          ...company,
          companyColumnName: transformCompanyName(
            company.companyName,
            company.priceType,
          ),
        })),
      );
      setOverseasPriceData(overseasData.priceData);
      console.log("domesticData", domesticData);
      console.log("overseasData", overseasData);

      // 컬럼 순서 로드 추가
      try {
        const userColumnOrder = await getUserQuotationColumnOrder();
        setColumnOrder(userColumnOrder || defaultQuotationColumnOrderFields);
      } catch (error) {
        console.error("컬럼 순서 로딩 오류:", error);
        setColumnOrder(defaultQuotationColumnOrderFields);
      }
    };
    fetchData();
  }, []);

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ko-KR").format(num);

  const transformCompanyName = (companyName: string, priceType: string) => {
    if (priceType === "arrival") {
      return `${companyName} (도착도)`;
    } else {
      return `${companyName} (상차도)`;
    }
  };

  // 업체 중복 체크 함수
  const checkCompanyDuplicate = (
    companyName: string,
    priceType: string,
    existingCompanies: ColumnCompany[],
  ) => {
    const isDuplicate = existingCompanies.some(
      (company) =>
        company.companyName === companyName && company.priceType === priceType,
    );

    if (isDuplicate) {
      const priceTypeLabel = priceType === "arrival" ? "도착도" : "상차도";
      throw new Error(
        `이미 존재하는 업체명과 가격 타입입니다. (${companyName} - ${priceTypeLabel})`,
      );
    }
  };

  // 품목 중복 체크 함수
  const checkItemDuplicate = (
    itemName: string,
    itemOrigin: string,
    existingItems: QuotationItem[],
  ) => {
    const isDuplicate = existingItems.some(
      (item) => item.itemName === itemName && item.itemOrigin === itemOrigin,
    );

    if (isDuplicate) {
      throw new Error(
        `이미 존재하는 품목입니다. (${itemName} - ${itemOrigin})`,
      );
    }
  };

  // 모바일 회사 선택 핸들러 (견적서용 품목만 자동 선택)
  const handleMobileCompanySelect = useCallback(
    (company: ColumnCompany) => {
      setMobileSelectedCompany(company);

      // 기존 견적서용 선택 상태 초기화
      setMobileSelectedColumns({});
      // 관리용 선택 상태도 함께 초기화 추가
      setMobileSelectedColumnsForManagement({});

      // 새로 선택된 회사의 가격이 있는 품목들을 견적서용으로만 자동 선택
      const companyPriceData = priceData[company.id] || {};
      const newSelectedColumns: Record<string, boolean> = {};

      items.forEach((item) => {
        const price = companyPriceData[item.id];
        if (price && price > 0) {
          newSelectedColumns[item.id] = true;
        }
      });

      setMobileSelectedColumns(newSelectedColumns);
      // 관리용 선택은 건드리지 않음 (카드 색상 변경 없음)
    },
    [priceData, items],
  );

  // 모바일 품목 관리용 선택 핸들러 (카드 색상 변경용)
  const handleMobileItemManagementSelect = useCallback((itemId: string) => {
    setMobileSelectedColumnsForManagement((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // 교차점 데이터 계산 (데스크톱/모바일 통합)
  const getIntersectionItems = () => {
    const intersectionItems: Array<{
      productCode: string;
      productName: string;
      company: string;
      priceType: string;
      price: number;
      origin: string;
      originEn: string;
      productNameEn: string;
    }> = [];

    if (isMobile) {
      // 모바일용 로직
      if (!mobileSelectedCompany) return intersectionItems;

      Object.entries(mobileSelectedColumns).forEach(([itemId, isSelected]) => {
        if (isSelected) {
          const product = items.find((item) => item.id === itemId);
          const price = priceData[mobileSelectedCompany.id]?.[itemId] || 0;

          if (price > 0) {
            intersectionItems.push({
              productCode: itemId,
              productName: product?.itemName || "",
              origin: product?.itemOrigin || "",
              company: mobileSelectedCompany.companyName || "",
              priceType: mobileSelectedCompany.priceType || "",
              price,
              originEn: product?.itemOriginEn || "",
              productNameEn: product?.itemNameEn || "",
            });
          }
        }
      });
    } else {
      // 데스크톱용 로직 (기존)
      Object.entries(selectedRows).forEach(([companyId, isRowSelected]) => {
        if (isRowSelected) {
          Object.entries(selectedColumns).forEach(([itemId, isColSelected]) => {
            if (isColSelected) {
              const product = items.find((item) => item.id === itemId);
              const company = companies.find((c) => c.id === companyId);
              const price = priceData[companyId]?.[itemId] || 0;

              if (price > 0) {
                intersectionItems.push({
                  productCode: itemId,
                  productName: product?.itemName || "",
                  origin: product?.itemOrigin || "",
                  company: company?.companyName || companyId,
                  priceType: company?.priceType || "",
                  price,
                  originEn: product?.itemOriginEn || "",
                  productNameEn: product?.itemNameEn || "",
                });
              }
            }
          });
        }
      });
    }

    // 컬럼 순서에 따라 품목 정렬
    const sortedItems = intersectionItems.sort((a, b) => {
      const aIndex = columnOrder.findIndex(
        (col) => col.field === a.productCode,
      );
      const bIndex = columnOrder.findIndex(
        (col) => col.field === b.productCode,
      );

      // 컬럼 순서에 없는 항목은 뒤로 정렬
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    return sortedItems;
  };

  // 업체 추가 핸들러
  const handleAddCompany = (values: CompanyFormValues) => {
    const newCompany = values.name;
    const newPriceType = values.priceType;

    // 중복 체크 - 업체명과 가격 타입(상차도/도착도) 모두 검사
    checkCompanyDuplicate(newCompany, newPriceType, companies);

    const newCompanyObj = {
      id: nanoid(),
      companyName: newCompany,
      companyType: tab,
      priceType: values.priceType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newColumnCompany = {
      ...newCompanyObj,
      companyColumnName: transformCompanyName(
        newCompanyObj.companyName,
        newCompanyObj.priceType,
      ),
    };

    setCompanies((prev) => [...prev, newColumnCompany]);
    setPriceData((prev) => ({
      ...prev,
      [newCompanyObj.id]: {}, // 회사 ID를 키로 사용
    }));

    addQuotationCompanyAction(newCompanyObj);
    updateQuotationCellAction({
      companyId: newCompanyObj.id,
      itemId: tab === "domestic" ? domesticItems[0].id : overseasItems[0].id,
      value: 0,
    });
  };

  // 품목 추가 핸들러
  const handleAddItem = (values: ItemFormValues) => {
    // 중복 체크 (이름과 원산지 기준)
    checkItemDuplicate(values.itemName, values.itemOrigin, items);

    const newItem = {
      id: nanoid(),
      itemName: values.itemName,
      itemOrigin: values.itemOrigin,
      itemNameEn: values.itemNameEn,
      itemOriginEn: values.itemOriginEn,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, newItem]);
    addQuotationItemAction(newItem);
    updateQuotationCellAction({
      companyId:
        tab === "domestic" ? domesticCompanies[0].id : overseasCompanies[0].id,
      itemId: newItem.id,
      value: 0,
    });
  };

  const handleDeleteCompany = () => {
    const targetCompany = isMobile ? mobileSelectedCompany : selectedCompany;
    if (!targetCompany) return;

    setCompanies((prev) =>
      prev.filter((company) => company.id !== targetCompany.id),
    );
    deleteQuotationCompanyAction(targetCompany.id);
    setPriceData((prev) => {
      const updated = { ...prev };
      delete updated[targetCompany.id];
      return updated;
    });

    if (isMobile) {
      setMobileSelectedCompany(null);
    } else {
      setSelectedCompany(null);
    }
    setCompanyDeleteModalOpen(false);
  };

  const handleDeleteItems = () => {
    const targetSelectedColumns = isMobile
      ? mobileSelectedColumnsForManagement
      : selectedColumnsForManagement;
    const selectedManagementItems = Object.keys(targetSelectedColumns).filter(
      (key) => targetSelectedColumns[key],
    );

    if (selectedManagementItems.length === 0) return;

    setItems((prev) =>
      prev.filter((item) => !selectedManagementItems.includes(item.id)),
    );
    selectedManagementItems.forEach((itemId) => {
      deleteQuotationItemAction(itemId);
    });
    setPriceData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((company) => {
        selectedManagementItems.forEach((itemId) => {
          // itemId를 직접 키로 사용하도록 변경
          if (updated[company][itemId]) {
            delete updated[company][itemId];
          }
        });
      });
      return updated;
    });

    if (isMobile) {
      setMobileSelectedColumnsForManagement({});
    } else {
      setSelectedColumnsForManagement({});
    }
    setItemDeleteModalOpen(false);
  };

  const handleEditCompany = (values: CompanyFormValues) => {
    const targetCompany = isMobile ? mobileSelectedCompany : selectedCompany;
    if (!targetCompany) return;

    checkCompanyDuplicate(values.name, values.priceType, companies);
    updateCompanyAction(targetCompany.id, {
      companyName: values.name,
      companyType: tab,
      priceType: values.priceType,
    });
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === targetCompany.id
          ? {
              ...company,
              companyName: values.name,
              priceType: values.priceType,
              companyColumnName: transformCompanyName(
                values.name,
                values.priceType,
              ),
            }
          : company,
      ),
    );
    setCompanyEditModalOpen(false);
  };

  const handleEditItem = (values: ItemFormValues) => {
    const targetSelectedColumns = isMobile
      ? mobileSelectedColumnsForManagement
      : selectedColumnsForManagement;
    const selectedManagementItems = Object.keys(targetSelectedColumns).filter(
      (key) => targetSelectedColumns[key],
    );

    if (selectedManagementItems.length === 0) return;

    checkItemDuplicate(values.itemName, values.itemOrigin, items);
    updateItemAction(selectedManagementItems[0], {
      itemName: values.itemName,
      itemOrigin: values.itemOrigin,
      itemNameEn: values.itemNameEn,
      itemOriginEn: values.itemOriginEn,
    });
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedManagementItems[0]
          ? {
              ...item,
              itemName: values.itemName,
              itemOrigin: values.itemOrigin,
              itemNameEn: values.itemNameEn,
              itemOriginEn: values.itemOriginEn,
            }
          : item,
      ),
    );

    if (isMobile) {
      setMobileSelectedColumnsForManagement({});
    } else {
      setSelectedColumnsForManagement({});
    }
    setItemEditModalOpen(false);
  };

  //업데이트 함수 (행/열 변경: data.id=회사ID, column=품목ID)
  const handleCellValueChanged = async (params: CellValueChangedEvent) => {
    try {
      // ag-grid에서 제공하는 정보 추출
      const companyId = params.data.id; // 회사 ID (이제 행이 회사)
      const itemId = params.column.getColId(); // 품목 ID (이제 컬럼이 품목)

      // 여러 방법으로 새로운 값 확인
      const newValue = params.newValue; // 새로운 값
      const oldValue = params.oldValue; // 이전 값
      const currentValue = params.data[itemId]; // 현재 데이터에서 값

      console.log("=== 셀 값 변경 디버깅 ===");
      console.log("companyId:", companyId);
      console.log("itemId:", itemId);
      console.log("newValue:", newValue);
      console.log("oldValue:", oldValue);
      console.log("currentValue:", currentValue);
      console.log("params:", params);

      // itemId가 없으면 처리하지 않음 (체크박스 컬럼, 업체명 컬럼 등)
      if (
        !itemId ||
        typeof itemId !== "string" ||
        itemId === "companyColumnName"
      ) {
        console.log("itemId가 유효하지 않음, 처리 중단");
        return;
      }

      // 새로운 값 결정 (newValue가 없으면 currentValue 사용)
      const finalValue = newValue !== undefined ? newValue : currentValue;

      // 숫자로 변환 (빈 값이면 null)
      const numericValue =
        finalValue === "" || finalValue === null || finalValue === undefined
          ? null
          : Number(finalValue);

      console.log("finalValue:", finalValue);
      console.log("numericValue:", numericValue);

      // 로컬 상태 업데이트 (itemId로 저장하도록 변경)
      setPriceData((prev) => ({
        ...prev,
        [companyId]: {
          ...prev[companyId],
          [itemId]: numericValue || 0,
        },
      }));

      // 서버에 업데이트 요청
      await updateQuotationCellAction({
        itemId,
        companyId,
        value: numericValue,
      });

      console.log(
        `셀 값 업데이트 완료: 회사 ${companyId}, 제품 ${itemId}, 값 ${numericValue}`,
      );
    } catch (error) {
      console.error("셀 값 업데이트 실패:", error);
      // 에러 발생 시 사용자에게 알림
      alert("가격 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // PDF 생성 공통 로직
  const generatePDFData = async () => {
    const quotationData = getIntersectionItems();

    if (quotationData.length === 0) {
      throw new Error("선택된 견적 항목이 없습니다.");
    }

    // 컬럼 순서에 따라 품목들을 한 번 더 정렬하여 PDF에 반영
    console.log("PDF 생성 시 컬럼 순서:", columnOrder);
    console.log("PDF 생성 시 견적 데이터:", quotationData);

    const sortedQuotationData = quotationData.sort((a, b) => {
      const aIndex = columnOrder.findIndex(
        (col) => col.field === a.productCode,
      );
      const bIndex = columnOrder.findIndex(
        (col) => col.field === b.productCode,
      );

      // 컬럼 순서에 없는 항목은 뒤로 정렬
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    console.log("PDF 생성 시 정렬된 견적 데이터:", sortedQuotationData);

    const pdfResponse = await generateQuotationPDF({
      sender: "㈜ 곰표",
      receiver: sortedQuotationData[0].company,
      date: new Date().toISOString().split("T")[0],
      items: sortedQuotationData.map((item, index) => ({
        no: index + 1,
        name: item.productName,
        originEn: item.originEn,
        nameEn: item.productNameEn,
        price: item.price,
      })),
      documentNumber: generateDocumentNumber(),
      priceType: sortedQuotationData[0].priceType,
      reference: "",
    });

    if (!pdfResponse.success || !pdfResponse.pdf) {
      throw new Error(pdfResponse.error || "PDF 생성에 실패했습니다.");
    }

    // base64 문자열을 Uint8Array로 변환
    const binaryString = atob(pdfResponse.pdf);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return {
      bytes,
      filename: pdfResponse.filename || "견적서.pdf",
    };
  };

  // PDF 다운로드 함수
  const handleQuotationPDFDownload = async () => {
    try {
      const { bytes, filename } = await generatePDFData();

      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("PDF 다운로드 완료:", filename);
    } catch (error) {
      console.error("PDF 다운로드 중 오류 발생:", error);
      alert(
        "PDF 다운로드 중 오류가 발생했습니다: " +
          (error instanceof Error ? error.message : "알 수 없는 오류"),
      );
    }
  };

  // PDF 새창에서 열기 함수
  const handleQuotationPDFView = async () => {
    try {
      const { bytes, filename } = await generatePDFData();

      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");

      if (newWindow) {
        // 새 창이 로드된 후 제목 설정
        newWindow.addEventListener("load", () => {
          try {
            newWindow.document.title = filename;
          } catch (titleError) {
            console.warn("새 창 제목 설정 실패:", titleError);
          }
        });

        // 1초 후 URL 정리 (새 창에서 로드 완료 후)
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        console.log("PDF 새 창에서 열기 완료:", filename);
      } else {
        // 팝업이 차단된 경우 다운로드로 대체
        alert("팝업이 차단되었습니다. 다운로드로 진행합니다.");

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("팝업 차단으로 다운로드 대체 완료:", filename);
      }
    } catch (error) {
      console.error("PDF 새창 열기 중 오류 발생:", error);
      alert(
        "PDF 새창 열기 중 오류가 발생했습니다: " +
          (error instanceof Error ? error.message : "알 수 없는 오류"),
      );
    }
  };

  // 모바일용 가격 수정 핸들러
  const handleMobilePriceEditModalOpen = useCallback(
    (itemData: { itemId: string; itemName: string; currentPrice: number }) => {
      setSelectedItemForPriceEdit(itemData);
      setMobilePriceEditModalOpen(true);
    },
    [],
  );

  // 모바일용 가격 수정 성공 콜백 (견적서에 자동 추가)
  const handleMobilePriceEditSuccess = useCallback(
    (newPrice: number, itemId: string) => {
      // 가격이 0보다 크면 견적서용 선택에 자동 추가
      if (newPrice > 0) {
        setMobileSelectedColumns((prev) => ({
          ...prev,
          [itemId]: true,
        }));
      } else {
        // 가격이 0이면 견적서용 선택에서 제거
        setMobileSelectedColumns((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
      }
      console.log(`가격이 ${newPrice}원으로 업데이트되었습니다.`);
    },
    [],
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8 pb-20 sm:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">견적서 작성</h1>
        </div>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
          <div
            className="flex flex-row justify-between items-end flex-shrink-0 overflow-x-auto"
            style={{ minHeight: 24 }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#22C55E",
                },
                "& .MuiTab-root": {
                  color: "#6B7280",
                  "&.Mui-selected": {
                    color: "#22C55E",
                  },
                  "&:hover": {
                    color: "#16A34A",
                  },
                },
              }}
            >
              <Tab label="국내 업체" value="domestic" />
              <Tab label="해외 업체" value="overseas" />
            </Tabs>
          </div>

          {/* 데스크톱 버튼들 - sm 이상에서만 표시 */}
          <div className="hidden sm:block overflow-auto w-full">
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
                justifyContent: { xs: "flex-start", lg: "flex-end" },
                pb: 1,
                overflowX: "auto",
                flexWrap: "nowrap",
                minWidth: "max-content",
                "& > *": {
                  flexShrink: 0,
                },
              }}
            >
              <CommonButton
                variant="info"
                onClick={() => setCompanyModalOpen(true)}
              >
                업체 추가
              </CommonButton>

              <CommonButton
                variant="info"
                onClick={() => setItemModalOpen(true)}
              >
                품목 추가
              </CommonButton>
              <CommonButton
                variant="primary"
                onClick={() => setCompanyEditModalOpen(true)}
                disabled={!selectedCompany}
              >
                업체 수정
              </CommonButton>

              <CommonButton
                variant="primary"
                onClick={() => setItemEditModalOpen(true)}
                disabled={
                  Object.keys(selectedColumnsForManagement).filter(
                    (key) => selectedColumnsForManagement[key],
                  ).length !== 1
                }
              >
                품목 수정
              </CommonButton>

              <CommonButton
                variant="danger"
                onClick={() => setCompanyDeleteModalOpen(true)}
                disabled={!selectedCompany}
              >
                업체 삭제
              </CommonButton>

              <CommonButton
                variant="danger"
                onClick={() => setItemDeleteModalOpen(true)}
                disabled={
                  Object.keys(selectedColumnsForManagement).filter(
                    (key) => selectedColumnsForManagement[key],
                  ).length === 0
                }
              >
                품목 삭제
              </CommonButton>

              <CommonButton
                variant="special"
                onClick={() => setQuotationDocumentModalOpen(true)}
                disabled={getIntersectionItems().length === 0}
              >
                견적서 작성 ({getIntersectionItems().length})
              </CommonButton>
            </Stack>
          </div>
        </Stack>

        {/* 그리드 */}
        {isMobile ? (
          <QuotationMobileView
            companies={companies}
            items={items}
            priceData={priceData}
            formatNumber={formatNumber}
            getIntersectionItems={getIntersectionItems}
            // 모바일 상태들 전달
            selectedCompany={mobileSelectedCompany}
            selectedColumns={mobileSelectedColumns}
            selectedColumnsForManagement={mobileSelectedColumnsForManagement}
            onCompanySelect={handleMobileCompanySelect}
            onItemSelect={handleMobileItemManagementSelect}
            // 모달 핸들러들
            onCompanyModalOpen={() => setCompanyModalOpen(true)}
            onItemModalOpen={() => setItemModalOpen(true)}
            onCompanyEditModalOpen={() => setCompanyEditModalOpen(true)}
            onItemEditModalOpen={() => setItemEditModalOpen(true)}
            onCompanyDeleteModalOpen={() => setCompanyDeleteModalOpen(true)}
            onItemDeleteModalOpen={() => setItemDeleteModalOpen(true)}
            onQuotationDocumentModalOpen={() =>
              setQuotationDocumentModalOpen(true)
            }
            onPriceEditModalOpen={handleMobilePriceEditModalOpen}
          />
        ) : (
          <div className="overflow-auto lg:h-[75vh]">
            <QuotationGrid
              items={items.map((item) => ({
                id: item.id,
                code: item.itemOrigin,
                name: item.itemName,
                origin: item.itemOrigin,
              }))}
              companies={companies}
              priceData={priceData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              selectedColumnsForManagement={selectedColumnsForManagement}
              setSelectedColumnsForManagement={setSelectedColumnsForManagement}
              getIntersectionItems={getIntersectionItems}
              formatNumber={formatNumber}
              onCompanySelect={setSelectedCompany}
              onCellValueChanged={handleCellValueChanged}
              onItemsSelect={() => {}}
              onColumnOrderChange={handleColumnOrderChange}
            />
          </div>
        )}

        {/* 데스크톱용 선택된 교차점 표시 */}
        {!isMobile && getIntersectionItems().length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">
              선택된 견적 항목: {getIntersectionItems().length}개
            </p>
            <div className="text-xs text-green-700 mt-1">
              {getIntersectionItems().map((item, idx) => (
                <span key={idx}>
                  {item.company}에서 {item.productName} (
                  {formatNumber(item.price)}원)
                  {idx < getIntersectionItems().length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <CompanyAddModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSubmit={handleAddCompany}
      />

      {(() => {
        const targetCompany = isMobile
          ? mobileSelectedCompany
          : selectedCompany;
        return targetCompany &&
          companies.find((c) => c.id === targetCompany.id) ? (
          <CompanyEditModal
            open={companyEditModalOpen}
            onClose={() => setCompanyEditModalOpen(false)}
            onSubmit={handleEditCompany}
            selectedCompany={
              companies.find((c) => c.id === targetCompany?.id) || targetCompany
            }
          />
        ) : null;
      })()}

      <ItemAddModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleAddItem}
      />

      {(() => {
        const targetSelectedColumns = isMobile
          ? mobileSelectedColumnsForManagement
          : selectedColumnsForManagement;
        const selectedManagementItems = Object.keys(
          targetSelectedColumns,
        ).filter((key) => targetSelectedColumns[key]);
        const selectedItem =
          selectedManagementItems.length > 0
            ? items.find((i) => i.id === selectedManagementItems[0])
            : null;

        return selectedItem ? (
          <ItemEditModal
            open={itemEditModalOpen}
            onClose={() => setItemEditModalOpen(false)}
            onSubmit={handleEditItem}
            selectedItem={selectedItem}
          />
        ) : null;
      })()}

      <CompanyDeleteModal
        open={companyDeleteModalOpen}
        onClose={() => setCompanyDeleteModalOpen(false)}
        onConfirm={handleDeleteCompany}
      />
      <ItemDeleteModal
        open={itemDeleteModalOpen}
        onClose={() => setItemDeleteModalOpen(false)}
        onConfirm={handleDeleteItems}
      />
      <QuotationDocumentModal
        open={quotationDocumentModalOpen}
        onClose={() => setQuotationDocumentModalOpen(false)}
        onDownload={handleQuotationPDFDownload}
        onOpenInNewWindow={handleQuotationPDFView}
      />

      {selectedItemForPriceEdit && mobileSelectedCompany && (
        <PriceEditModal
          open={mobilePriceEditModalOpen}
          onClose={() => {
            setMobilePriceEditModalOpen(false);
            setSelectedItemForPriceEdit(null);
          }}
          onSuccess={(newPrice) =>
            handleMobilePriceEditSuccess(
              newPrice,
              selectedItemForPriceEdit.itemId,
            )
          }
          itemName={selectedItemForPriceEdit.itemName}
          currentPrice={selectedItemForPriceEdit.currentPrice}
          itemId={selectedItemForPriceEdit.itemId}
          companyId={mobileSelectedCompany.id}
          setPriceData={setPriceData}
        />
      )}
    </div>
  );
}
