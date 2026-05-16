const { loadEnv, defineConfig } = require("@medusajs/framework/utils")

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const toOriginList = (...values) => {
  const items = values
    .flatMap((value) => (value ?? "").split(","))
    .map((item) => item.trim())
    .filter(Boolean)

  return Array.from(new Set(items)).join(",")
}

const backendUrl =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

module.exports = defineConfig({
  admin: {
    disable: false,
    path: "/app",
    backendUrl,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode:
      process.env.MEDUSA_WORKER_MODE ||
      (process.env.NODE_ENV === "production" ? "shared" : undefined),
    http: {
      storeCors: toOriginList(process.env.STORE_CORS, backendUrl),
      adminCors: toOriginList(process.env.ADMIN_CORS, backendUrl),
      authCors: toOriginList(process.env.AUTH_CORS, backendUrl),
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
})
