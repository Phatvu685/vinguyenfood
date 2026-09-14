import { NextResponse } from "next/server";

const demoVouchers = [
  {
    code: "GAODON10",
    desc: "Giảm 10% đơn hàng đầu tiên",
    exp: "31/12/2026",
    active: true,
    discountType: "percent",
    discountValue: 10,
  },
  {
    code: "FREESHIP",
    desc: "Miễn phí vận chuyển đơn từ 200k",
    exp: "30/09/2026",
    active: true,
    discountType: "shipping",
    discountValue: 30000,
  },
];

export async function GET() {
  return NextResponse.json(demoVouchers);
}
