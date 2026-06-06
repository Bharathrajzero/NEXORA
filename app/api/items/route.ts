import { NextResponse } from "next/server";
import { z } from "zod";

const createItemSchema = z.object({
  type: z.enum(["clip", "file", "note", "bookmark", "prompt"]),
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(20000),
  tags: z.array(z.string().min(1).max(32)).max(12).default([]),
  collection: z.string().min(1).max(80).default("Inbox")
});

export function GET() {
  // Return empty array for fresh start
  return NextResponse.json({ items: [] });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = createItemSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid item payload", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      data: {
        id: crypto.randomUUID(),
        ...parsed.data,
        createdAt: new Date().toISOString(),
        meta: "Created through API",
        favorite: false
      }
    },
    { status: 201 }
  );
}
