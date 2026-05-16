import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { getDemoAppState } from "../../../lib/demo-mobile-state"
import { demoShopSnapshot } from "../../../lib/demo-shop-snapshot"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const demoState = await getDemoAppState()

  res.json({
    branch_count: demoShopSnapshot.stores.length,
    channel: "mobile-app",
    snapshot: demoShopSnapshot,
    state: demoState.state,
    updated_at: demoState.updatedAt,
  })
}
