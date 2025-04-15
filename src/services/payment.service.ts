import { db } from "@/db";
import { payments, paymentsTt, paymentsUsance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CalculatedPayment } from "./cargo-calculator";

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type PaymentTt = typeof paymentsTt.$inferSelect;
export type NewPaymentTt = typeof paymentsTt.$inferInsert;
export type PaymentUsance = typeof paymentsUsance.$inferSelect;
export type NewPaymentUsance = typeof paymentsUsance.$inferInsert;

export type CreatePaymentData = {
  payment: NewPayment;
  paymentTt?: NewPaymentTt;
  paymentUsance?: NewPaymentUsance;
};

export class PaymentService {
  // Create
  async createWithDetails(data: CreatePaymentData) {
    try {
      // 기본 결제 정보 생성
      const [payment] = await db
        .insert(payments)
        .values(data.payment)
        .returning();

      // 결제 방식에 따라 상세 정보 생성
      switch (data.payment.paymentMethod) {
        case "T/T":
          if (!data.paymentTt) {
            throw new Error("T/T 결제 방식에는 paymentTt 데이터가 필요합니다.");
          }
          await this.createTt({
            ...data.paymentTt,
            paymentId: payment.id,
          });
          break;

        case "Usance":
          if (!data.paymentUsance) {
            throw new Error(
              "Usance 결제 방식에는 paymentUsance 데이터가 필요합니다.",
            );
          }
          await this.createUsance({
            ...data.paymentUsance,
            paymentId: payment.id,
          });
          break;

        case "CAD":
        case "L/C":
          // CAD와 L/C는 추가 데이터가 필요하지 않음
          break;

        default:
          throw new Error(
            `지원하지 않는 결제 방식입니다: ${data.payment.paymentMethod}`,
          );
      }

      return payment;
    } catch (error) {
      console.error("결제 정보 생성 중 오류 발생:", error);
      throw error;
    }
  }

  async create(data: NewPayment) {
    const [payment] = await db.insert(payments).values(data).returning();
    return payment;
  }

  async createTt(data: NewPaymentTt) {
    const [paymentTt] = await db.insert(paymentsTt).values(data).returning();
    return paymentTt;
  }

  async createUsance(data: NewPaymentUsance) {
    const [paymentUsance] = await db
      .insert(paymentsUsance)
      .values(data)
      .returning();
    return paymentUsance;
  }

  // Read
  async findById(id: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment;
  }

  async findTtByPaymentId(paymentId: string) {
    const [paymentTt] = await db
      .select()
      .from(paymentsTt)
      .where(eq(paymentsTt.paymentId, paymentId));
    return paymentTt;
  }

  async findUsanceByPaymentId(paymentId: string) {
    const [paymentUsance] = await db
      .select()
      .from(paymentsUsance)
      .where(eq(paymentsUsance.paymentId, paymentId));
    return paymentUsance;
  }

  async findAll() {
    const paymentList = await db.select().from(payments);

    const result = await Promise.all(
      paymentList.map(async (payment: Payment) => {
        const [paymentTt] = await db
          .select()
          .from(paymentsTt)
          .where(eq(paymentsTt.paymentId, payment.id));

        const [paymentUsance] = await db
          .select()
          .from(paymentsUsance)
          .where(eq(paymentsUsance.paymentId, payment.id));

        // 계약금액 계산
        const totalContractAmount = paymentTt
          ? (paymentTt.advancePaymentAmount || 0) +
            (paymentTt.remainingPaymentAmount || 0)
          : 0;

        return {
          ...payment,
          paymentDueDate: payment.paymentDueDate,
          // T/T 관련 필드
          advancePaymentDate: paymentTt?.advancePaymentDate ?? null,
          advancePaymentRatio: paymentTt?.advancePaymentRatio ?? null,
          advancePaymentAmount: paymentTt?.advancePaymentAmount ?? null,
          remainingPaymentDate: paymentTt?.remainingPaymentDate ?? null,
          remainingPaymentRatio: paymentTt?.remainingPaymentRatio ?? null,
          remainingPaymentAmount: paymentTt?.remainingPaymentAmount ?? null,
          counterpartBank: paymentTt?.counterpartBank ?? null,
          // Usance 관련 필드
          paymentTerm: paymentUsance?.paymentTerm ?? null,
          contractExchangeRate: paymentUsance?.contractExchangeRate ?? null,
          // 계약금액
          totalContractAmount,
        };
      }),
    );

    return result;
  }

  async findByContractId(contractId: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.contractId, contractId));

    if (!payment) {
      return null;
    }

    const [paymentTt] = await db
      .select()
      .from(paymentsTt)
      .where(eq(paymentsTt.paymentId, payment.id));

    const [paymentUsance] = await db
      .select()
      .from(paymentsUsance)
      .where(eq(paymentsUsance.paymentId, payment.id));

    // 계약금액 계산
    const totalContractAmount = paymentTt
      ? (paymentTt.advancePaymentAmount || 0) +
        (paymentTt.remainingPaymentAmount || 0)
      : 0;

    return {
      ...payment,
      paymentDueDate: payment.paymentDueDate,
      // T/T 관련 필드
      advancePaymentDate: paymentTt?.advancePaymentDate ?? null,
      advancePaymentRatio: paymentTt?.advancePaymentRatio ?? null,
      advancePaymentAmount: paymentTt?.advancePaymentAmount ?? null,
      remainingPaymentDate: paymentTt?.remainingPaymentDate ?? null,
      remainingPaymentRatio: paymentTt?.remainingPaymentRatio ?? null,
      remainingPaymentAmount: paymentTt?.remainingPaymentAmount ?? null,
      counterpartBank: paymentTt?.counterpartBank ?? null,
      // Usance 관련 필드
      paymentTerm: paymentUsance?.paymentTerm ?? null,
      contractExchangeRate: paymentUsance?.contractExchangeRate ?? null,
      // 계약금액
      totalContractAmount,
    };
  }

  // Update
  // TODO: 계산로직 다시 살펴보기
  async update(id: string, data: Partial<CalculatedPayment>) {
    try {
      // 기존 결제 정보 조회
      const [existingPayment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, id));

      if (!existingPayment) {
        throw new Error("결제 정보를 찾을 수 없습니다.");
      }

      // 결제 방식이 변경된 경우
      if (existingPayment.paymentMethod !== data.paymentMethod) {
        // 기존 결제 방식에 따른 데이터 삭제
        switch (existingPayment.paymentMethod) {
          case "T/T":
            await this.deleteTt(id);
            break;
          case "Usance":
            await this.deleteUsance(id);
            break;
        }

        // 새로운 결제 방식에 따른 데이터 생성
        switch (data.paymentMethod) {
          case "T/T":
            if (!data.advancePaymentDate || !data.remainingPaymentDate) {
              throw new Error(
                "T/T 결제 방식에는 선급금과 잔금 날짜가 필요합니다.",
              );
            }

            await this.createTt({
              paymentId: id,
              advancePaymentDate: data.advancePaymentDate,
              advancePaymentRatio: data.advancePaymentRatio || 30,
              advancePaymentAmount:
                ((data.totalContractAmount || 0) *
                  (data.advancePaymentRatio || 30)) /
                100,
              remainingPaymentDate: data.remainingPaymentDate,
              remainingPaymentRatio: data.remainingPaymentRatio || 70,
              remainingPaymentAmount:
                ((data.totalContractAmount || 0) *
                  (data.remainingPaymentRatio || 70)) /
                100,
              counterpartBank: data.counterpartBank || "",
            });
            break;

          case "Usance":
            if (!data.paymentTerm) {
              throw new Error("Usance 결제 방식에는 결제 기간이 필요합니다.");
            }
            await this.createUsance({
              paymentId: id,
              paymentTerm: data.paymentTerm,
            });
            break;
        }
      } else {
        // 결제 방식이 변경되지 않은 경우
        switch (data.paymentMethod) {
          case "T/T":
            if (!data.advancePaymentDate || !data.remainingPaymentDate) {
              throw new Error(
                "T/T 결제 방식에는 선급금과 잔금 날짜가 필요합니다.",
              );
            }

            await this.updateTt(id, {
              advancePaymentDate: data.advancePaymentDate,
              advancePaymentRatio: data.advancePaymentRatio,
              remainingPaymentDate: data.remainingPaymentDate,
              remainingPaymentRatio: data.remainingPaymentRatio,
              counterpartBank: data.counterpartBank || "",
              advancePaymentAmount:
                ((data.totalContractAmount || 0) *
                  (data.advancePaymentRatio || 30)) /
                100,
              remainingPaymentAmount:
                ((data.totalContractAmount || 0) *
                  (data.remainingPaymentRatio || 70)) /
                100,
            });
            break;

          case "Usance":
            if (!data.paymentTerm) {
              throw new Error("Usance 결제 방식에는 결제 기간이 필요합니다.");
            }
            await this.updateUsance(id, {
              paymentTerm: data.paymentTerm,
            });
            break;
        }
      }

      // 기본 결제 정보 업데이트
      const [payment] = await db
        .update(payments)
        .set({
          paymentMethod: data.paymentMethod,
          paymentDueDate: data.paymentDueDate,
        })
        .where(eq(payments.id, id))
        .returning();

      return payment;
    } catch (error) {
      console.error("결제 정보 업데이트 중 오류 발생:", error);
      throw error;
    }
  }

  async updateTt(paymentId: string, data: Partial<NewPaymentTt>) {
    // 저장 시에만 금액 계산
    if (
      data.advancePaymentRatio !== undefined &&
      data.advancePaymentRatio !== null
    ) {
      const totalAmount =
        (data.advancePaymentAmount || 0) + (data.remainingPaymentAmount || 0);
      const ratios = this.calculatePaymentRatios({
        totalContractAmount: totalAmount,
        advancePaymentRatio: data.advancePaymentRatio,
      });

      data = {
        ...data,
        advancePaymentAmount: ratios.advancePaymentAmount,
        remainingPaymentAmount: ratios.remainingPaymentAmount,
      };
    }

    const [paymentTt] = await db
      .update(paymentsTt)
      .set(data)
      .where(eq(paymentsTt.paymentId, paymentId))
      .returning();
    return paymentTt;
  }

  async updateUsance(paymentId: string, data: Partial<NewPaymentUsance>) {
    const [paymentUsance] = await db
      .update(paymentsUsance)
      .set(data)
      .where(eq(paymentsUsance.paymentId, paymentId))
      .returning();
    return paymentUsance;
  }

  // Delete
  async delete(id: string) {
    const [payment] = await db
      .delete(payments)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async deleteTt(paymentId: string) {
    const [paymentTt] = await db
      .delete(paymentsTt)
      .where(eq(paymentsTt.paymentId, paymentId))
      .returning();
    return paymentTt;
  }

  async deleteUsance(paymentId: string) {
    const [paymentUsance] = await db
      .delete(paymentsUsance)
      .where(eq(paymentsUsance.paymentId, paymentId))
      .returning();
    return paymentUsance;
  }

  private calculatePaymentRatios(input: {
    totalContractAmount: number;
    advancePaymentRatio?: number;
  }) {
    const { totalContractAmount, advancePaymentRatio = 30 } = input;

    // 잔금 비율은 100%에서 선급금 비율을 뺀 값
    const remainingRatio = 100 - advancePaymentRatio;

    // 금액 계산
    const advanceAmount = Math.round(
      (totalContractAmount * advancePaymentRatio) / 100,
    );
    const remainingAmount = totalContractAmount - advanceAmount;

    return {
      advancePaymentRatio,
      remainingPaymentRatio: remainingRatio,
      advancePaymentAmount: advanceAmount,
      remainingPaymentAmount: remainingAmount,
    };
  }
}
