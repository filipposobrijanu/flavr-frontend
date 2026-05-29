import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Flavr API is running smoothly 🚀",
  });
}
