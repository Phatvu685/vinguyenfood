import { NextResponse } from "next/server";

const demoContent = [
  {
    id: 1,
    type: "banner",
    title: "TINH HOA HẠT GẠO",
    description: "Gạo ngon, an toàn và thơm mỗi ngày.",
    image: "/images/hero-rice.png",
  },
  {
    id: 2,
    type: "about",
    title: "Vigen Food",
    description: "Nông sản sạch, chất lượng và đáng tin cậy.",
    image: "/images/vigenfood.png",
  },
];

export async function GET() {
  return NextResponse.json(demoContent);
}
