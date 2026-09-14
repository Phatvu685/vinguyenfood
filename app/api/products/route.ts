import { NextResponse } from "next/server";
import { products } from "../../san-pham/data";

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const nextProduct = {
    ...payload,
    id: Number(payload.id || Date.now()),
    price: Number(payload.price || 0),
    reviews: Number(payload.reviews || 0),
    rating: Number(payload.rating || 0),
  };

  return NextResponse.json(nextProduct, { status: 201 });
}
