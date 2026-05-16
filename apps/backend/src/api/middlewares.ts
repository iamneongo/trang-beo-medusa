import {
  defineMiddlewares,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http"

const ONE_YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365

async function forceVietnameseAdminLocale(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (req.cookies?.lng !== "vi") {
    res.cookie("lng", "vi", {
      httpOnly: false,
      maxAge: ONE_YEAR_IN_MS,
      path: "/",
      sameSite: "lax",
      secure: req.secure || req.get("x-forwarded-proto") === "https",
    })
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: /^\/app(?:\/.*)?$/,
      middlewares: [forceVietnameseAdminLocale],
    },
  ],
})
