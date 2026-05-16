import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { demoShopSnapshot } from "../../../../lib/demo-shop-snapshot"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({
    channel: "mobile-app",
    branch_count: demoShopSnapshot.stores.length,
    snapshot: demoShopSnapshot,
  })
}
