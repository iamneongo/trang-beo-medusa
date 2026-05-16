import { Pool } from "pg"

export type DemoOrderStatus = "Đang chuẩn bị" | "Đang giao" | "Hoàn thành" | "Đã hủy"

export type DemoOrderRecord = {
  eta: string
  id: string
  itemIds: string[]
  items: string
  status: DemoOrderStatus
  total: string
}

export type DemoAccountActionRecord = {
  icon: string
  id: string
  label: string
  value: string
}

export type DemoAppState = {
  accountActions: DemoAccountActionRecord[]
  addressIndex: number
  cartCounts: Record<string, number>
  favoriteIds: string[]
  orders: DemoOrderRecord[]
  selectedStoreId: null | string
}

export const initialDemoAppState: DemoAppState = {
  accountActions: [
    { id: "profile", icon: "user", label: "Thông tin cá nhân", value: "Tuấn Anh" },
    { id: "address", icon: "map-pin", label: "Địa chỉ giao hàng", value: "Nhà riêng" },
    { id: "payment", icon: "credit-card", label: "Thanh toán", value: "Tiền mặt" },
  ],
  addressIndex: 0,
  cartCounts: {},
  favoriteIds: ["special", "thigh", "combo-1"],
  orders: [
    {
      eta: "Dự kiến 12 phút",
      id: "TB-240514",
      itemIds: ["special", "drink-3"],
      items: "1 Phở gà miếng đặc biệt • 1 Trà quất",
      status: "Đang chuẩn bị",
      total: "63.000đ",
    },
    {
      eta: "Đã giao 11:32",
      id: "TB-240510",
      itemIds: ["thigh", "thigh"],
      items: "2 Phở gà miếng đùi",
      status: "Hoàn thành",
      total: "80.000đ",
    },
  ],
  selectedStoreId: null,
}

const STATE_KEY = "mobile-demo-state"

let pool: Pool | null = null
let schemaReady = false

const shouldUseSsl = (databaseUrl: string) =>
  databaseUrl.includes("sslmode=require") || databaseUrl.includes("neon.tech")

const getPool = () => {
  if (pool) {
    return pool
  }

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required")
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
  })

  return pool
}

const ensureSchema = async () => {
  if (schemaReady) {
    return
  }

  await getPool().query(`
    CREATE TABLE IF NOT EXISTS demo_mobile_state (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  schemaReady = true
}

const isOrderStatus = (value: unknown): value is DemoOrderStatus =>
  value === "Đang chuẩn bị" ||
  value === "Đang giao" ||
  value === "Hoàn thành" ||
  value === "Đã hủy"

export const normalizeDemoAppState = (
  value: Partial<DemoAppState> | null | undefined
): DemoAppState => {
  const source = value ?? {}

  const favoriteIds = Array.isArray(source.favoriteIds)
    ? source.favoriteIds.filter((item): item is string => typeof item === "string")
    : initialDemoAppState.favoriteIds

  const cartCounts =
    source.cartCounts && typeof source.cartCounts === "object"
      ? Object.fromEntries(
          Object.entries(source.cartCounts).filter(
            (entry): entry is [string, number] =>
              typeof entry[0] === "string" &&
              typeof entry[1] === "number" &&
              Number.isFinite(entry[1]) &&
              entry[1] >= 0
          )
        )
      : initialDemoAppState.cartCounts

  const orders = Array.isArray(source.orders)
    ? source.orders.filter(
        (order): order is DemoOrderRecord =>
          !!order &&
          typeof order.id === "string" &&
          typeof order.items === "string" &&
          Array.isArray(order.itemIds) &&
          order.itemIds.every((item) => typeof item === "string") &&
          typeof order.eta === "string" &&
          typeof order.total === "string" &&
          isOrderStatus(order.status)
      )
    : initialDemoAppState.orders

  const accountActions = Array.isArray(source.accountActions)
    ? source.accountActions.filter(
        (action): action is DemoAccountActionRecord =>
          !!action &&
          typeof action.id === "string" &&
          typeof action.icon === "string" &&
          typeof action.label === "string" &&
          typeof action.value === "string"
      )
    : initialDemoAppState.accountActions

  return {
    accountActions: accountActions.length ? accountActions : initialDemoAppState.accountActions,
    addressIndex:
      typeof source.addressIndex === "number" && Number.isFinite(source.addressIndex)
        ? Math.max(0, Math.floor(source.addressIndex))
        : initialDemoAppState.addressIndex,
    cartCounts,
    favoriteIds: favoriteIds.length ? favoriteIds : initialDemoAppState.favoriteIds,
    orders: orders.length ? orders : initialDemoAppState.orders,
    selectedStoreId: typeof source.selectedStoreId === "string" ? source.selectedStoreId : null,
  }
}

export const getDemoAppState = async () => {
  await ensureSchema()

  const current = await getPool().query<{
    updated_at: Date
    value: DemoAppState
  }>("SELECT value, updated_at FROM demo_mobile_state WHERE key = $1 LIMIT 1", [STATE_KEY])

  if (current.rowCount && current.rows[0]) {
    return {
      state: normalizeDemoAppState(current.rows[0].value),
      updatedAt: current.rows[0].updated_at.toISOString(),
    }
  }

  const state = normalizeDemoAppState(initialDemoAppState)
  const inserted = await getPool().query<{
    updated_at: Date
  }>(
    `
      INSERT INTO demo_mobile_state (key, value)
      VALUES ($1, $2::jsonb)
      RETURNING updated_at
    `,
    [STATE_KEY, JSON.stringify(state)]
  )

  return {
    state,
    updatedAt: inserted.rows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  }
}

export const saveDemoAppState = async (value: Partial<DemoAppState> | DemoAppState) => {
  await ensureSchema()

  const state = normalizeDemoAppState(value)
  const updated = await getPool().query<{
    updated_at: Date
  }>(
    `
      INSERT INTO demo_mobile_state (key, value, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING updated_at
    `,
    [STATE_KEY, JSON.stringify(state)]
  )

  return {
    state,
    updatedAt: updated.rows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
  }
}
