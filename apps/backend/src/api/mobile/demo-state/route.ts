import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import {
  getDemoAppState,
  normalizeDemoAppState,
  saveDemoAppState,
} from "../../../lib/demo-mobile-state"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const demoState = await getDemoAppState()

  res.json({
    state: demoState.state,
    updated_at: demoState.updatedAt,
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = (req.body ?? {}) as Record<string, unknown>
  const rawState =
    body && typeof body === "object" && "state" in body && typeof body.state === "object"
      ? body.state
      : body

  const result = await saveDemoAppState(normalizeDemoAppState(rawState as never))

  res.json({
    ok: true,
    state: result.state,
    updated_at: result.updatedAt,
  })
}
