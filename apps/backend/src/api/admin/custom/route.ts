import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { getDemoAppState } from "../../../lib/demo-mobile-state";
import { demoShopSnapshot } from "../../../lib/demo-shop-snapshot";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const demoState = await getDemoAppState();

  res.json({
    branch_count: demoShopSnapshot.stores.length,
    category_count: demoShopSnapshot.categories.length,
    favorite_count: demoState.state.favoriteIds.length,
    order_count: demoState.state.orders.length,
    payment_mode: demoState.state.accountActions.find((item) => item.id === "payment")?.value ?? null,
    selected_store_id: demoState.state.selectedStoreId,
    state_updated_at: demoState.updatedAt,
  });
}
