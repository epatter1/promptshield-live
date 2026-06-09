import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET() {
  const result = await db.execute(
    "SELECT * FROM PromptShieldEvents ORDER BY timestamp ASC"
  );

  return NextResponse.json({
    events: result.rows,
  });
}