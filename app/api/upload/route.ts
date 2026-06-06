import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const file = formData.get("file") as File | null;

    if (!title || (!body && !file)) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    let content = body;
    let itemType: "CLIP" | "FILE" | "NOTE" = "CLIP";

    if (file) {
      content = `File: ${file.name} (${file.size} bytes)`;
      itemType = "FILE";
    } else if (type === "note") {
      itemType = "NOTE";
    }

    const [newItem] = await db.insert(items).values({
      type: itemType,
      title,
      body: content,
      ownerId: user.id,
      tags: ["shared"]
    }).returning();

    return NextResponse.json({ item: newItem });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
