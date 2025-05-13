import { z } from "zod";

export const oneDecimalZod = z
  .string()
  .superRefine((val, ctx) => {
    const allowedFormat = /^-?\d+(\.\d)?$/; // 우리가 허용하는 포맷
    const hasExtraDecimal = /^-?\d+\.\d{2,}$/; // 소수점 2자리 이상
    const isBroadlyNumeric = /^[-+]?\d*(\.\d+)?([eE].+)?$/;

    const isNumeric = !isNaN(Number(val));

    // (1) 숫자 아님
    if (!isNumeric) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }

    // ✅ (2) 소수점 두 자리 이상 먼저 검사!
    if (hasExtraDecimal.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "숫자는 소수점 한 자리까지만 입력 가능합니다.",
      });
      return;
    }

    // (3) 과학 표기법, +기호 등 허용 안 함
    if (isBroadlyNumeric.test(val) && !allowedFormat.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }

    // (4) 그 외 허용되지 않는 형식
    if (!allowedFormat.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }
  })
  .transform((val) => parseFloat(val));

export const oneDecimalPositiveZod = z
  .string()
  .superRefine((val, ctx) => {
    const isNumeric = !isNaN(Number(val));
    const allowedFormat = /^-?\d+(\.\d)?$/;
    const hasExtraDecimal = /^-?\d+\.\d{2,}$/;
    const isBroadlyNumeric = /^[-+]?\d*(\.\d+)?([eE].+)?$/;

    // 1. 유효한 숫자인지 확인
    if (!isNumeric) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }

    // 2. 음수인지 확인
    const parsed = parseFloat(val);
    if (parsed < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "0 이상의 숫자만 입력 가능합니다.",
      });
      return;
    }

    // 3. 소수점 2자리 이상인지 확인
    if (hasExtraDecimal.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "숫자는 소수점 한 자리까지만 입력 가능합니다.",
      });
      return;
    }

    // 4. 특이한 숫자 표기법 (+, e, .5 등) 거르기
    if (isBroadlyNumeric.test(val) && !allowedFormat.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }

    // 5. 일반적인 허용 포맷 아닌 경우
    if (!allowedFormat.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 숫자여야 합니다.",
      });
      return;
    }
  })
  .transform((val) => parseFloat(val));
