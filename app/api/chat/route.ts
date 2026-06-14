import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import { semanticRiskLevel, semanticCategory } from "../../teacher/lib/safety/semantic";
import { computeRiskScore } from "../../teacher/lib/safety/score";
import { safeRewrite } from "../../teacher/lib/safety/rewrite";
import { evaluateAlert } from "../../teacher/lib/safety/alerts";

import { logAlert } from "../../teacher/lib/db/alerts";
import { logEvent } from "../../teacher/lib/db/events";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatResponse {
  sessionId: string;
  input: string;
  output?: string | null;
  rewritten?: string | null;
  riskLevel: string;
  riskScore: number;
  semanticCategory: string;   // ⭐ ADDED
  alert: string;
}

export async function POST(req: Request) {
  try {
    const { sessionId, input } = await req.json();
    const timestamp = new Date().toISOString();
    const start = Date.now();

    // --- SEMANTIC SIGNALS ---
    const riskLevel = await semanticRiskLevel(input);
    const riskScore = await computeRiskScore(input);
    const category = await semanticCategory(input);   // ⭐ FIXED

    let rewriteApplied = false;
    let rewrittenText: string | null = null;

    if (riskLevel !== "SAFE") {
      rewrittenText = await safeRewrite(input);
      rewriteApplied = true;
    }

    const alert = await evaluateAlert({
      input,
      riskScore,
      rewriteApplied
    });

    if (alert.shouldAlert) {
      await logAlert({
        sessionId,
        timestamp,
        input,
        riskLevel,
        riskScore,
        reason: alert.reason
      });
    }

    // --- REWRITE PATH ---
    if (rewriteApplied) {
      const latencyMs = Date.now() - start;

      await logEvent({
        sessionId,
        timestamp,
        input,
        safeResponse: rewrittenText,
        rawResponse: null,
        classification: category,   // ⭐ FIXED
        riskLevel,
        injectionDetected: 0,
        rewriteApplied: 1,
        evalToxicity: riskScore,
        modelName: "rewrite-engine",
        latencyMs
      });

      const response: ChatResponse = {
        sessionId,
        input,
        rewritten: rewrittenText,
        riskLevel,
        riskScore,
        semanticCategory: category,   // ⭐ ADDED
        alert: alert.reason
      };

      return NextResponse.json(response);
    }

    // --- NORMAL COMPLETION ---
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: input }]
    });

    const output = completion.choices[0].message.content ?? null;
    const latencyMs = Date.now() - start;

    await logEvent({
      sessionId,
      timestamp,
      input,
      safeResponse: null,
      rawResponse: output,
      classification: category,   // ⭐ FIXED
      riskLevel,
      injectionDetected: 0,
      rewriteApplied: 0,
      evalToxicity: riskScore,
      modelName: "llama-3.1-8b-instant",
      latencyMs
    });

    const response: ChatResponse = {
      sessionId,
      input,
      output,
      riskLevel,
      riskScore,
      semanticCategory: category,   // ⭐ ADDED
      alert: alert.reason
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}