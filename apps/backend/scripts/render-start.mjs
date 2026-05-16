import { execSync, spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const port = process.env.PORT || "10000"

const env = {
  ...process.env,
  NODE_ENV: "production",
}

execSync("npx medusa db:migrate", {
  cwd: rootDir,
  env,
  stdio: "inherit",
})

const server = spawn("npx", ["medusa", "start", "--host", "0.0.0.0", "--port", port], {
  cwd: rootDir,
  env,
  stdio: "inherit",
})

server.on("error", (error) => {
  console.error(error)
  process.exit(1)
})

server.on("exit", (code) => {
  process.exit(code ?? 0)
})
