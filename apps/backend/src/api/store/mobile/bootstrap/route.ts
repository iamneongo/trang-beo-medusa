import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { getDemoAppState } from "../../../../lib/demo-mobile-state"
import { demoShopSnapshot } from "../../../../lib/demo-shop-snapshot"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const demoState = await getDemoAppState()

  res.json({
    channel: "mobile-app",
    branch_count: demoShopSnapshot.stores.length,
    snapshot: demoShopSnapshot,
    state: demoState.state,
    updated_at: demoState.updatedAt,
  })
}
