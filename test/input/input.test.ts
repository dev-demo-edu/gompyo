import { test, Page, expect } from "@playwright/test";
import { login } from "../utils/login";

type Input = {
  role: "textbox" | "combobox";
  name: string;
  value: string;
};

/**
 * Common Input Test Code
 */

async function changeInput(page: Page, sectionTitle: string, input: Input) {
  const sectionButton = await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${sectionTitle}$`) })
    .getByRole("button");
  await sectionButton.click();

  const field = await page.getByRole(input.role, { name: input.name });
  await field.fill(input.value);

  await sectionButton.first().click();

  await page
    .getByText("데이터가 성공적으로 저장되었습니다.")
    .waitFor({ timeout: 5000 });
  await page.reload();

  const reloadField = await page.getByRole(input.role, { name: input.name });
  await expect(reloadField).toHaveValue(input.value);
}
/**
 * ------------------------------------------
 */

/**
 * For TextBox ( 안쓰는 부분 주석처리함 )
 */
// async function changeTextBoxInputOnlyNumber(page: Page, sectionTitle: string, inputs: Input[]) {
//   for (const input of inputs) {
//     // 추후에 일괄적으로 데이터 넣어서 Test 진행하려면,
//     // 여기 부분에서 input.value를 수정하는 코드 추가하면 됨.
//     await changeInput(page, sectionTitle, input);
//   }
// };

async function changeTextBoxInputOnlyDate(
  page: Page,
  sectionTitle: string,
  inputs: Input[],
) {
  for (const input of inputs) {
    await changeInput(page, sectionTitle, input);
  }
}

async function changeTextBoxInput(
  page: Page,
  sectionTitle: string,
  inputs: Input[],
) {
  for (const input of inputs) {
    await changeInput(page, sectionTitle, input);
  }
}
/**
 * ------------------------------------------
 */

/**
 * For ComboBox
 */
// async function changeComboBoxInputOnlyNumber(page: Page, sectionTitle: string, inputs: Input[]) {
//   for (const input of inputs) {
//     await changeInput(page, sectionTitle, input);
//   }
// }

// async function changeComboBoxInputOnlyDate(page: Page, sectionTitle: string, inputs: Input[]) {
//   for (const input of inputs) {
//     await changeInput(page, sectionTitle, input);
//   }
// }

async function changeComboBoxInput(
  page: Page,
  sectionTitle: string,
  inputs: Input[],
) {
  for (const input of inputs) {
    await changeInput(page, sectionTitle, input);
  }
}
/**
 * ------------------------------------------
 */

test.describe("input 테스트 (계획 관리 > 상세보기)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "admin@example.com", "password123");

    await page.goto("http://localhost:3000/plan");
    await page.getByRole("link", { name: "상세보기" }).first().click();
  });

  test.describe("계약 정보", () => {
    const sectionTitle = "계약 정보";

    test("TextBox", async ({ page }) => {
      await changeTextBoxInput(page, sectionTitle, [
        { role: "textbox", name: "계약 번호", value: "a" },
        { role: "textbox", name: "공급업체", value: "a" },
        { role: "textbox", name: "인코텀즈", value: "a" },
        { role: "textbox", name: "출발항", value: "a" },
        { role: "textbox", name: "도착항", value: "a" },
      ]);
    });

    test("TextBoxOnlyDate", async ({ page }) => {
      await changeTextBoxInputOnlyDate(page, sectionTitle, [
        { role: "textbox", name: "계약 일자", value: "2222-02-22" },
        { role: "textbox", name: "ETD", value: "2222-02-22" },
        { role: "textbox", name: "ETA", value: "2222-02-22" },
      ]);
    });

    test("ComboBox", async ({ page }) => {
      await changeComboBoxInput(page, sectionTitle, [
        { role: "combobox", name: "수입회사", value: "a" },
      ]);
    });
  });

  test("결제 정보", async ({ page }) => {
    // await changeInputData(page, '결제 정보');
  });

  test("원가 정보", async ({ page }) => {
    // await changeInputData(page, '원가 정보');
  });

  test("수입회사 금액 정보", async ({ page }) => {
    // await changeInputData(page, '수입회사 금액 정보');
  });

  test("비용 정보", async ({ page }) => {
    // await changeInputData(page, '비용 정보');
  });
});
