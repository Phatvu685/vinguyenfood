import { NextResponse } from "next/server";

const demoSettings = {
  siteName: "Vigen Food",
  supportPhone: "1900 1234",
  supportEmail: "support@vigenfood.com",
  enableFreeShipping: true,
  freeShippingThreshold: 200000,
  allowGuestCheckout: true,
  showOutOfStock: true,
  maintenanceMode: false,
};

export async function GET() {
  return NextResponse.json(demoSettings);
}

export async function PUT(request: Request) {
  const payload = await request.json();
  return NextResponse.json({
    ...demoSettings,
    ...payload,
  });
}
