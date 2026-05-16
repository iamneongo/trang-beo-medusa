import type { IncomingMessage, ServerResponse } from "http"

import express, { type Express } from "express"
import { existsSync } from "fs"
import path from "path"

type MedusaLoader = (options: {
  directory: string
  expressApp: Express
  skipLoadingEntryPoints?: boolean
}) => Promise<unknown>

const medusaLoader = require("@medusajs/medusa/dist/loaders").default as MedusaLoader

declare global {
  // eslint-disable-next-line no-var
  var __TRANG_BEO_MEDUSA_APP__: Promise<Express> | undefined
}

const builtDirectory = path.join(process.cwd(), ".medusa", "server")
const rootDirectory = existsSync(builtDirectory) ? builtDirectory : process.cwd()

const createApp = async () => {
  const app = express()

  await medusaLoader({
    directory: rootDirectory,
    expressApp: app,
  })

  app.get("/health", (_, res) => {
    res.status(200).send("OK")
  })

  return app
}

const getApp = () => {
  global.__TRANG_BEO_MEDUSA_APP__ ??= createApp()
  return global.__TRANG_BEO_MEDUSA_APP__
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp()
  return app(req as never, res as never)
}
