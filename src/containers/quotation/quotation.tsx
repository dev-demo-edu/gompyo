"use client";
import { useEffect, useState } from "react";
import QuotationGrid from "./quotation-grid";
import {
  CompanyAddModal,
  CompanyDeleteModal,
  CompanyEditModal,
  ItemAddModal,
  ItemDeleteModal,
  ItemEditModal,
  QuotationDocumentModal,
} from "./quotation-modal-container";
import { CompanyFormValues } from "./company-form";
import { ItemFormValues } from "./item-form";
import { Stack, Tab, Tabs } from "@mui/material";
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
import {
  QuotationCompany,
  // QuotationGridItem,
  QuotationItem,
} from "@/services/quotation-service";
import { nanoid } from "nanoid";
import { CellValueChangedEvent } from "ag-grid-community";
import CommonButton from "@/components/common-button";

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
  // 모달 상태 관리
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companyEditModalOpen, setCompanyEditModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemEditModalOpen, setItemEditModalOpen] = useState(false);
  const [companyDeleteModalOpen, setCompanyDeleteModalOpen] = useState(false);
  const [itemDeleteModalOpen, setItemDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<QuotationCompany | null>(null);
  const [quotationDocumentModalOpen, setQuotationDocumentModalOpen] =
    useState(false);

  // 선택 상태 관리 (QuotationGrid에서 상위로 이동)
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({}); // 견적서용 품목 선택
  const [selectedColumnsForManagement, setSelectedColumnsForManagement] =
    useState<Record<string, boolean>>({}); // 컬럼 관리용 품목 선택

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

  // 교차점 데이터 계산 (행/열 변경: selectedRows=회사, selectedColumns=품목)
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

    // selectedRows는 이제 회사 선택 상태
    Object.entries(selectedRows).forEach(([companyId, isRowSelected]) => {
      if (isRowSelected) {
        // selectedColumns는 이제 품목 선택 상태
        Object.entries(selectedColumns).forEach(([itemId, isColSelected]) => {
          if (isColSelected) {
            const product = items.find((item) => item.id === itemId);
            const company = companies.find((c) => c.id === companyId);
            const price = priceData[companyId]?.[product?.itemName || ""] || 0;

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
    return intersectionItems;
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
    if (!selectedCompany) return;

    setCompanies((prev) =>
      prev.filter((company) => company.id !== selectedCompany.id),
    );
    deleteQuotationCompanyAction(selectedCompany.id);
    setPriceData((prev) => {
      const updated = { ...prev };
      delete updated[selectedCompany.id];
      return updated;
    });
    setSelectedCompany(null);
    setCompanyDeleteModalOpen(false);
  };

  const handleDeleteItems = () => {
    const selectedManagementItems = Object.keys(
      selectedColumnsForManagement,
    ).filter((key) => selectedColumnsForManagement[key]);

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
          const item = items.find((i) => i.id === itemId);
          if (item && updated[company][item.itemName]) {
            delete updated[company][item.itemName];
          }
        });
      });
      return updated;
    });
    setSelectedColumnsForManagement({});
    setItemDeleteModalOpen(false);
  };

  const handleEditCompany = (values: CompanyFormValues) => {
    if (!selectedCompany) return;
    checkCompanyDuplicate(values.name, values.priceType, companies);
    updateCompanyAction(selectedCompany.id, {
      companyName: values.name,
      companyType: tab,
      priceType: values.priceType,
    });
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === selectedCompany.id
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
    // setSelectedCompany(null);
    setCompanyEditModalOpen(false);
  };

  const handleEditItem = (values: ItemFormValues) => {
    const selectedManagementItems = Object.keys(
      selectedColumnsForManagement,
    ).filter((key) => selectedColumnsForManagement[key]);

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
    setSelectedColumnsForManagement({});
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

      // 로컬 상태 업데이트 (제품명으로 저장)
      const product = items.find((item) => item.id === itemId);
      if (product) {
        setPriceData((prev) => ({
          ...prev,
          [companyId]: {
            ...prev[companyId],
            [product.itemName]: numericValue || 0,
          },
        }));
      }

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
    const pdfResponse = await generateQuotationPDF({
      sender: "㈜ 곰표",
      receiver: quotationData[0].company,
      date: new Date().toISOString().split("T")[0],
      items: quotationData.map((item, index) => ({
        no: index + 1,
        name: item.productName,
        originEn: item.originEn,
        nameEn: item.productNameEn,
        price: item.price,
      })),
      documentNumber: generateDocumentNumber(),
      priceType: quotationData[0].priceType,
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

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
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
                  backgroundColor: "#22C55E", // 선택된 탭 하단 인디케이터 색상
                },
                "& .MuiTab-root": {
                  color: "#6B7280", // 기본 탭 텍스트 색상
                  "&.Mui-selected": {
                    color: "#22C55E", // 선택된 탭 텍스트 색상
                  },
                  "&:hover": {
                    color: "#16A34A", // 호버 시 색상
                  },
                },
              }}
            >
              <Tab label="국내 업체" value="domestic" />
              <Tab label="해외 업체" value="overseas" />
            </Tabs>
          </div>
          {/* 모든 버튼들을 한 줄에 배치 */}
          <div className="overflow-auto w-full">
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
        <div className="overflow-hidden">
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
          />
        </div>

        {/* 선택된 교차점 표시 */}
        {getIntersectionItems().length > 0 && (
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

      {selectedCompany &&
        companies.find((c) => c.id === selectedCompany.id) && (
          <CompanyEditModal
            open={companyEditModalOpen}
            onClose={() => setCompanyEditModalOpen(false)}
            onSubmit={handleEditCompany}
            selectedCompany={
              companies.find((c) => c.id === selectedCompany?.id) ||
              selectedCompany
            }
          />
        )}

      <ItemAddModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleAddItem}
      />

      {(() => {
        const selectedManagementItems = Object.keys(
          selectedColumnsForManagement,
        ).filter((key) => selectedColumnsForManagement[key]);
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
    </div>
  );
}
