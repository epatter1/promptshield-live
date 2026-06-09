import { NextResponse } from "next/server";
import { db } from "@/lib/db/turso";

export async function GET() {
  const result = await db.execute(
    "SELECT * FROM PromptShieldEvents ORDER BY timestamp ASC LIMIT 500"
  );

  const events = result.rows;

  return NextResponse.json({
    events,
  });
}