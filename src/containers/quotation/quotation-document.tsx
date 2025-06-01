// components/KimpoInvoicePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import path from "path";

// 한글 폰트 등록 - 하나의 패밀리에 여러 굵기 등록
Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: path.join(process.cwd(), "public", "fonts", "NotoSansKR-Thin.ttf"),
      fontWeight: 100,
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansKR-ExtraLight.ttf",
      ),
      fontWeight: 200,
    },
    {
      src: path.join(process.cwd(), "public", "fonts", "NotoSansKR-Light.ttf"),
      fontWeight: 300,
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansKR-Regular.ttf",
      ),
      fontWeight: 400,
    },
    {
      src: path.join(process.cwd(), "public", "fonts", "NotoSansKR-Medium.ttf"),
      fontWeight: 500,
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansKR-SemiBold.ttf",
      ),
      fontWeight: 600,
    },
    {
      src: path.join(process.cwd(), "public", "fonts", "NotoSansKR-Bold.ttf"),
      fontWeight: 700,
    },
    {
      src: path.join(
        process.cwd(),
        "public",
        "fonts",
        "NotoSansKR-ExtraBold.ttf",
      ),
      fontWeight: 800,
    },
    {
      src: path.join(process.cwd(), "public", "fonts", "NotoSansKR-Black.ttf"),
      fontWeight: 900,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 11,
    fontFamily: "NotoSansKR",
  },

  // 헤더 - 회사명
  header: {
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "NotoSansKR",
  },
  companyName: {
    fontSize: 24,
    fontFamily: "NotoSansKR",
    fontWeight: 700,
    // marginBottom: 5,
    textAlign: "center",
  },

  // 회사 정보
  companyInfo: {
    fontSize: 12,
    lineHeight: 1.2,
    marginBottom: 4,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
  },

  // 문서 정보 섹션
  documentInfo: {
    // marginBottom: 20,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
  },

  // 인사말
  greeting: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 11,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
  },

  // 아래 텍스트
  belowText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "NotoSansKR",
    fontWeight: 700,
    marginBottom: 20,
  },

  // 단위 표시
  unitInfo: {
    textAlign: "right",
    fontSize: 10,
    marginBottom: 5,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
  },

  // 구분선 스타일 추가
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    // marginBottom: 15,
    width: "100%",
  },

  // 구분선 스타일 추가
  divider_thin: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    // marginBottom: 15,
    width: "100%",
  },

  // 테이블 스타일 - 크기 축소
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 30,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#f0f0f0",
    padding: 3,
    textAlign: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 3,
    textAlign: "center",
  },
  tableColNo: {
    width: "10%",
  },
  tableColProduct: {
    width: "50%",
  },
  tableColPrice: {
    width: "20%",
  },
  tableColNote: {
    width: "20%",
  },

  tableCellHeader: {
    fontSize: 10,
    fontFamily: "NotoSansKR",
    fontWeight: 700,
  },
  tableCell: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
    fontWeight: 600,
  },
  tableCellLeft: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
    fontWeight: 600,
    textAlign: "left",
    marginLeft: 5,
  },
  tableCellRight: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
    fontWeight: 800,
    textAlign: "right",
    marginRight: 5,
  },

  // 마무리 인사
  closing: {
    fontSize: 11,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
    textAlign: "center",
  },

  // 날짜 및 회사명
  footerDate: {
    fontSize: 14,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
    textAlign: "center",
  },

  footerCompany: {
    fontSize: 18,
    fontFamily: "NotoSansKR",
    fontWeight: 400,
    textAlign: "center",
  },

  // 도장 이미지 스타일 - 절대 위치
  stampImage: {
    position: "absolute",
    width: 60,
    height: 60,
    right: 170, // 오른쪽에서 100px
    bottom: 30, // 아래에서 50px
  },

  // 빈 행
  emptyRow: {
    height: 25,
  },
});

// 숫자를 한국 원화 형식으로 포맷
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export interface QuotationData {
  documentNumber?: string;
  sender?: string;
  receiver?: string;
  reference?: string;
  title?: string;
  date?: string;
  priceType?: string;
  items: {
    no: number;
    name: string;
    originEn: string;
    nameEn: string;
    price: number;
  }[];
  companyInfo?: {
    office: string;
    warehouse: string;
  };
}

interface QuotationDocumentProps {
  invoiceData: QuotationData;
}

export default function QuotationDocument({
  invoiceData,
}: QuotationDocumentProps) {
  const {
    documentNumber = "GP202401-01",
    sender = "㈜ 곰표",
    receiver = "",
    reference = "",
    title = "견적",
    date = new Date().toLocaleDateString("ko-KR"),
    items = [],
    companyInfo = {
      office:
        "인천광역시 중구 축항대로86번길 70 205호   T.032-888-9686, F.032-888-9685",
      warehouse:
        "안산시 단원구 별망로175 금은산업b동2층 T.032-888-9686, F.032-888-9685",
    },
    priceType = "도착도",
  } = invoiceData;

  const displayItems = items.length > 0 ? items : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 회사명 헤더 */}
        <View style={styles.header}>
          <Text style={styles.companyName}>㈜ 곰표</Text>
        </View>

        {/* 회사 정보 */}
        <View style={styles.companyInfo}>
          <Text>사무실 : {companyInfo.office}</Text>
          <Text>물류창고 : {companyInfo.warehouse}</Text>
        </View>

        {/* 검은색 굵은 구분선 추가 */}
        <View style={styles.divider} />

        {/* 문서 정보 */}
        <View style={styles.documentInfo}>
          <Text>▷문서번호 : {documentNumber}</Text>
          <Text>▷발 신 : {sender}</Text>
          <Text>▷수 신 : {receiver}</Text>
          <Text>▷참 조 : {reference}</Text>
          <Text>▷제 목 : {title}</Text>
        </View>

        {/* 검은색 굵은 구분선 추가 */}
        <View style={styles.divider_thin} />

        {/* 인사말 */}
        <View style={styles.greeting}>
          <Text>1. 귀사의 일익 번창하심을 진심으로 기원드립니다.</Text>
        </View>

        {/* 아래 */}
        <View style={styles.belowText}>
          <Text>― 아 래 ―</Text>
        </View>

        {/* 단위 정보 */}
        <View style={styles.unitInfo}>
          <Text>단위(원)</Text>
        </View>

        {/* 견적 테이블 */}
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.tableColNo]}>
              <Text style={styles.tableCellHeader}>NO</Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColProduct]}>
              <Text style={styles.tableCellHeader}>품 명</Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColPrice]}>
              <Text style={styles.tableCellHeader}>
                {priceType === "arrival" ? "도착도" : "상차도"} 원/kg
              </Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColNote]}>
              <Text style={styles.tableCellHeader}>비고</Text>
            </View>
          </View>

          {/* 테이블 데이터 */}
          {displayItems.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCol, styles.tableColNo]}>
                <Text style={styles.tableCell}>{item.no}</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColProduct]}>
                <Text style={styles.tableCellLeft}>
                  {`${item.name} ${item.originEn} ${item.nameEn}`}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.tableColPrice]}>
                <Text style={styles.tableCellRight}>
                  {item.price ? formatPrice(item.price) : ""}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.tableColNote]}></View>
            </View>
          ))}

          {/* 빈 행들 추가 (Excel 양식과 동일하게) */}
          {Array.from({ length: Math.max(0, 13 - displayItems.length) }).map(
            (_, index) => (
              <View style={styles.tableRow} key={`empty-${index}`}>
                <View style={[styles.tableCol, styles.tableColNo]}>
                  <Text style={styles.tableCell}>
                    {displayItems.length + index + 1}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.tableColProduct]}>
                  <Text style={styles.tableCell}> </Text>
                </View>
                <View style={[styles.tableCol, styles.tableColPrice]}>
                  <Text style={styles.tableCell}> </Text>
                </View>
                <View style={[styles.tableCol, styles.tableColNote]}>
                  <Text style={styles.tableCell}> </Text>
                </View>
              </View>
            ),
          )}
        </View>

        {/* 마무리 인사 */}
        <View style={styles.closing}>
          <Text>
            2. 위 내용에 대해서는 담당자에게 문의하여 주시기 바랍니다.
          </Text>
        </View>

        {/* 날짜 및 회사명 */}
        <View style={styles.footerDate}>
          <Text>{date}</Text>
        </View>
        <View style={styles.emptyRow} />
        <View style={styles.footerCompany}>
          <Text>주식회사 곰표</Text>
        </View>

        {/* 도장 이미지 - 절대 위치 */}
        <Image
          style={styles.stampImage}
          src={path.join(process.cwd(), "public", "gompyo_stamp.png")}
        />
      </Page>
    </Document>
  );
}
