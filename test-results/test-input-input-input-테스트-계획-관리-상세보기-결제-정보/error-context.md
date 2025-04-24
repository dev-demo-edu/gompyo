# Test info

- Name: input 테스트 (계획 관리 > 상세보기) >> 결제 정보
- Location: /Users/kang-yean-woo/gompyo/test/input/input.test.ts:147:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('a:has-text("상세보기")')

    at /Users/kang-yean-woo/gompyo/test/input/input.test.ts:110:16
```

# Page snapshot

```yaml
- navigation:
  - button
  - link "Logo":
    - /url: /
    - img "Logo"
  - button
  - separator
  - list:
    - listitem:
      - link "대시보드":
        - /url: /
    - listitem:
      - link "계획 관리":
        - /url: /plan
    - listitem:
      - link "선적 관리":
        - /url: /shipment
    - listitem:
      - link "테스트":
        - /url: /test
  - separator
  - paragraph: Gompyo Dashboard v0.1.0
  - paragraph: 2025 Gompyo
- main:
  - heading "계획 현황" [level=1]
  - button "추가하기"
  - button "<"
  - heading "필터" [level=2]
  - text: 검색어
  - textbox "검색어를 입력하세요"
  - text: 조회 기간
  - textbox
  - textbox
  - button "컬럼 순서 초기화"
  - text: 1 에서 15 의 20. 페이지 1 의 2
  - grid:
    - rowgroup:
      - row "계약 번호 진행 상태 계약일자 공급업체 수입회사 ETA 도착항":
        - columnheader "계약 번호"
        - columnheader "진행 상태"
        - columnheader "계약일자"
        - columnheader "공급업체"
        - columnheader "수입회사"
        - columnheader "ETA"
        - columnheader "도착항"
    - rowgroup:
      - row "2월 구매 연구 판매중 2025년 4월 24일 JJJ 남해 2025년 4월 1일":
        - gridcell "2월 구매 연구"
        - gridcell "판매중"
        - gridcell "2025년 4월 24일"
        - gridcell "JJJ"
        - gridcell "남해"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "NaN 통관완료 2025년 4월 24일 KKK DNB 2025년 4월 1일":
        - gridcell "NaN"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "KKK"
        - gridcell "DNB"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "84886 통관완료 2025년 4월 24일 KKK Standard 2025년 4월 1일":
        - gridcell "84886"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "KKK"
        - gridcell "Standard"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "84886 통관완료 2025년 4월 24일 LLL Standard 2025년 4월 1일":
        - gridcell "84886"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "LLL"
        - gridcell "Standard"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "1월 구매 통관완료 2025년 4월 24일 MMM Standard 2025년 4월 1일":
        - gridcell "1월 구매"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "MMM"
        - gridcell "Standard"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "84889 통관완료 2025년 4월 24일 NNN Standard 2025년 4월 1일":
        - gridcell "84889"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "NNN"
        - gridcell "Standard"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "84889 통관완료 2025년 4월 24일 OOO Standard 2025년 4월 1일":
        - gridcell "84889"
        - gridcell "통관완료"
        - gridcell "2025년 4월 24일"
        - gridcell "OOO"
        - gridcell "Standard"
        - gridcell "2025년 4월 1일"
        - gridcell
      - row "NaN 통관완료 2025년 3월 24일 CCC DNB 2025년 4월 25일":
        - gridcell "NaN"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "CCC"
        - gridcell "DNB"
        - gridcell "2025년 4월 25일"
        - gridcell
      - row "2월 구매 고려 통관완료 2025년 3월 24일 DDD DNB 2025년 4월 15일":
        - gridcell "2월 구매 고려"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "DDD"
        - gridcell "DNB"
        - gridcell "2025년 4월 15일"
        - gridcell
      - row "NaN 통관완료 2025년 3월 24일 EEE 남해 2025년 4월 15일":
        - gridcell "NaN"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "EEE"
        - gridcell "남해"
        - gridcell "2025년 4월 15일"
        - gridcell
      - row "84887 통관완료 2025년 3월 24일 FFF 남해 2025년 4월 15일":
        - gridcell "84887"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "FFF"
        - gridcell "남해"
        - gridcell "2025년 4월 15일"
        - gridcell
      - row "84887 통관완료 2025년 3월 24일 GGG 남해 2025년 4월 15일":
        - gridcell "84887"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "GGG"
        - gridcell "남해"
        - gridcell "2025년 4월 15일"
        - gridcell
      - row "NaN 통관완료 2025년 3월 24일 HHH 남해 2025년 4월 5일":
        - gridcell "NaN"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "HHH"
        - gridcell "남해"
        - gridcell "2025년 4월 5일"
        - gridcell
      - row "SCA0039185 통관완료 2025년 3월 24일 III 남해 2025년 4월 5일":
        - gridcell "SCA0039185"
        - gridcell "통관완료"
        - gridcell "2025년 3월 24일"
        - gridcell "III"
        - gridcell "남해"
        - gridcell "2025년 4월 5일"
        - gridcell
      - row "NaN 통관완료 2025년 2월 24일 AAA DNB 2025년 6월 5일":
        - gridcell "NaN"
        - gridcell "통관완료"
        - gridcell "2025년 2월 24일"
        - gridcell "AAA"
        - gridcell "DNB"
        - gridcell "2025년 6월 5일"
        - gridcell
    - rowgroup
    - rowgroup
    - rowgroup
  - text: "페이지 크기:"
  - combobox "페이지 크기"
  - text: 1 에서 15 의 20
  - button "첫 페이지" [disabled]
  - button "이전 페이지" [disabled]
  - text: 페이지 1 의 2
  - button "다음 페이지"
  - button "마지막 페이지"
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
   10 | /**
   11 |  * Common Input Test Code
   12 |  */
   13 |
   14 | async function changeInput(page: Page, sectionTitle: string, input: Input) {
   15 |   const sectionButton = await page
   16 |     .locator("div")
   17 |     .filter({ hasText: new RegExp(`^${sectionTitle}$`) })
   18 |     .getByRole("button");
   19 |   await sectionButton.click();
   20 |
   21 |   const field = await page.getByRole(input.role, { name: input.name });
   22 |   await field.fill(input.value);
   23 |
   24 |   await sectionButton.first().click();
   25 |
   26 |   await page
   27 |     .getByText("데이터가 성공적으로 저장되었습니다.")
   28 |     .waitFor({ timeout: 5000 });
   29 |   await page.reload();
   30 |
   31 |   const reloadField = await page.getByRole(input.role, { name: input.name });
   32 |   await expect(reloadField).toHaveValue(input.value);
   33 | }
   34 | /**
   35 |  * ------------------------------------------
   36 |  */
   37 |
   38 | /**
   39 |  * For TextBox ( 안쓰는 부분 주석처리함 )
   40 |  */
   41 | // async function changeTextBoxInputOnlyNumber(page: Page, sectionTitle: string, inputs: Input[]) {
   42 | //   for (const input of inputs) {
   43 | //     // 추후에 일괄적으로 데이터 넣어서 Test 진행하려면,
   44 | //     // 여기 부분에서 input.value를 수정하는 코드 추가하면 됨.
   45 | //     await changeInput(page, sectionTitle, input);
   46 | //   }
   47 | // };
   48 |
   49 | async function changeTextBoxInputOnlyDate(
   50 |   page: Page,
   51 |   sectionTitle: string,
   52 |   inputs: Input[],
   53 | ) {
   54 |   for (const input of inputs) {
   55 |     await changeInput(page, sectionTitle, input);
   56 |   }
   57 | }
   58 |
   59 | async function changeTextBoxInput(
   60 |   page: Page,
   61 |   sectionTitle: string,
   62 |   inputs: Input[],
   63 | ) {
   64 |   for (const input of inputs) {
   65 |     await changeInput(page, sectionTitle, input);
   66 |   }
   67 | }
   68 | /**
   69 |  * ------------------------------------------
   70 |  */
   71 |
   72 | /**
   73 |  * For ComboBox
   74 |  */
   75 | // async function changeComboBoxInputOnlyNumber(page: Page, sectionTitle: string, inputs: Input[]) {
   76 | //   for (const input of inputs) {
   77 | //     await changeInput(page, sectionTitle, input);
   78 | //   }
   79 | // }
   80 |
   81 | // async function changeComboBoxInputOnlyDate(page: Page, sectionTitle: string, inputs: Input[]) {
   82 | //   for (const input of inputs) {
   83 | //     await changeInput(page, sectionTitle, input);
   84 | //   }
   85 | // }
   86 |
   87 | async function changeComboBoxInput(
   88 |   page: Page,
   89 |   sectionTitle: string,
   90 |   inputs: Input[],
   91 | ) {
   92 |   for (const input of inputs) {
   93 |     await changeInput(page, sectionTitle, input);
   94 |   }
   95 | }
   96 | /**
   97 |  * ------------------------------------------
   98 |  */
   99 |
  100 | test.describe("input 테스트 (계획 관리 > 상세보기)", () => {
  101 |   test.beforeEach(async ({ page }) => {
  102 |     await login(page, "admin@example.com", "password123");
  103 |
  104 |     await page.goto("http://localhost:3000/plan");
  105 |
  106 |     // 페이지가 완전히 로드될 때까지 대기
  107 |     await page.waitForLoadState("networkidle");
  108 |
  109 |     // 요소가 DOM에 존재하는지 확인
> 110 |     await page.waitForSelector('a:has-text("상세보기")', {
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  111 |       state: "attached",
  112 |       timeout: 10000,
  113 |     });
  114 |
  115 |     // 요소 클릭
  116 |     await page.getByText("상세보기").first().click();
  117 |   });
  118 |
  119 |   test.describe("계약 정보", () => {
  120 |     const sectionTitle = "계약 정보";
  121 |
  122 |     test("TextBox", async ({ page }) => {
  123 |       await changeTextBoxInput(page, sectionTitle, [
  124 |         { role: "textbox", name: "계약 번호", value: "a" },
  125 |         { role: "textbox", name: "공급업체", value: "a" },
  126 |         { role: "textbox", name: "인코텀즈", value: "a" },
  127 |         { role: "textbox", name: "출발항", value: "a" },
  128 |         { role: "textbox", name: "도착항", value: "a" },
  129 |       ]);
  130 |     });
  131 |
  132 |     test("TextBoxOnlyDate", async ({ page }) => {
  133 |       await changeTextBoxInputOnlyDate(page, sectionTitle, [
  134 |         { role: "textbox", name: "계약 일자", value: "2222-02-22" },
  135 |         { role: "textbox", name: "ETD", value: "2222-02-22" },
  136 |         { role: "textbox", name: "ETA", value: "2222-02-22" },
  137 |       ]);
  138 |     });
  139 |
  140 |     test("ComboBox", async ({ page }) => {
  141 |       await changeComboBoxInput(page, sectionTitle, [
  142 |         { role: "combobox", name: "수입회사", value: "a" },
  143 |       ]);
  144 |     });
  145 |   });
  146 |
  147 |   test("결제 정보", async ({ page }) => {
  148 |     // await changeInputData(page, '결제 정보');
  149 |   });
  150 |
  151 |   test("원가 정보", async ({ page }) => {
  152 |     // await changeInputData(page, '원가 정보');
  153 |   });
  154 |
  155 |   test("수입회사 금액 정보", async ({ page }) => {
  156 |     // await changeInputData(page, '수입회사 금액 정보');
  157 |   });
  158 |
  159 |   test("비용 정보", async ({ page }) => {
  160 |     // await changeInputData(page, '비용 정보');
  161 |   });
  162 | });
  163 |
```
