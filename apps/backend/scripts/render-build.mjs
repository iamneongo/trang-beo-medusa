import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const buildDir = path.join(rootDir, ".medusa", "server")

execSync("npm run build", {
  cwd: rootDir,
  stdio: "inherit",
})

execSync("npm install --omit=dev --legacy-peer-deps", {
  cwd: buildDir,
  stdio: "inherit",
})
