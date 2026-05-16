import { execSync, spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const buildDir = path.join(rootDir, ".medusa", "server")
const medusaCliPath = path.resolve(rootDir, "../../node_modules/@medusajs/cli/cli.js")
const port = String(process.env.PORT || "10000").trim()

const env = {
  ...process.env,
  NODE_ENV: "production",
}

execSync(`"${process.execPath}" "${medusaCliPath}" db:migrate`, {
  cwd: buildDir,
  env,
  stdio: "inherit",
})

const server = spawn(
  process.execPath,
  [medusaCliPath, "start", "--host", "0.0.0.0", "--port", port],
  {
    cwd: buildDir,
    env,
    stdio: "inherit",
  }
)

server.on("error", (error) => {
  console.error(error)
  process.exit(1)
})

server.on("exit", (code) => {
  process.exit(code ?? 0)
})
