import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }

  return NextResponse.json({
    code: code.toUpperCase(),
    title: "Demo files",
    files: []
  });
}
