import { NextResponse } from "next/server";
import { runSafetyPipeline } from "@/lib/safety/pipeline";

export async function POST(req: Request) {
  const { input } = await req.json();
  const safety = await runSafetyPipeline(input);

  return NextResponse.json({ safety });
}