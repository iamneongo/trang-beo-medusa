import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const ONE_YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.cookie("lng", "vi", {
    httpOnly: false,
    maxAge: ONE_YEAR_IN_MS,
    path: "/",
    sameSite: "lax",
    secure: req.secure || req.get("x-forwarded-proto") === "https",
  })

  res.redirect(302, "/app")
}
