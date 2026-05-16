import { execSync, spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const buildDir = path.join(rootDir, ".medusa", "server")
const port = process.env.PORT || "10000"

const env = {
  ...process.env,
  NODE_ENV: "production",
}

execSync("npx medusa db:migrate", {
  cwd: buildDir,
  env,
  stdio: "inherit",
})

const server = spawn("npx", ["medusa", "start", "--host", "0.0.0.0", "--port", port], {
  cwd: buildDir,
  env,
  stdio: "inherit",
})

server.on("exit", (code) => {
  process.exit(code ?? 0)
})
