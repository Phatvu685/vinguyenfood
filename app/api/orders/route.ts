import { NextResponse } from "next/server";

const demoOrders = [
  {
    id: "#VG-DEMO-001",
    createdAt: new Date().toISOString(),
    status: "Thành công",
    customer: "Nguyễn Minh Anh",
    phone: "0900000001",
    email: "demo@vigenfood.com",
    address: "12 Đường Lúa Mới",
    province: "Cần Thơ",
    district: "Ninh Kiều",
    ward: "Tân An",
    total: 135000,
    paidAmount: 0,
    paymentStatus: "unpaid",
    subtotal: 135000,
    items: 1,
    paymentMethod: "cod",
    products: [{ productId: 1, quantity: 1, purchasePrice: 135000 }],
  },
];

export async function GET() {
  return NextResponse.json(demoOrders);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const newOrder = {
    id: payload.id || `#VG-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: payload.status || "Chờ xác nhận",
    customer: payload.customer || "Khách hàng",
    phone: payload.phone || "",
    email: payload.email,
    address: payload.address,
    total: Number(payload.total || 0),
    items: Number(payload.items || 1),
    products: payload.products || [],
    paymentMethod: payload.paymentMethod || "cod",
  };

  return NextResponse.json(newOrder, { status: 201 });
}
