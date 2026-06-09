import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await db.execute(
    "SELECT * FROM PromptShieldEvents WHERE sessionId = ? ORDER BY timestamp ASC",
    [id]
  );

  return NextResponse.json({
    events: result.rows,
  });
}