import { NextResponse } from "next/server";
import { categories } from "../../san-pham/data";

export async function GET() {
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json(
    {
      ...payload,
      id: Number(payload.id || Date.now()),
      active: Boolean(payload.active ?? true),
    },
    { status: 201 },
  );
}
