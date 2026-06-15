const { config } = require("dotenv");
const { execSync } = require("child_process");
const path = require("path");

const envPath = path.resolve(process.cwd(), ".env.local");
config({ path: envPath });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL ni nastavljen v .env.local");
  process.exit(1);
}

const cmd = process.argv.slice(2).join(" ");
if (!cmd) {
  console.error("Uporaba: node scripts/prisma-env.cjs <prisma ukaz>");
  process.exit(1);
}

execSync(cmd, { stdio: "inherit", env: process.env, shell: true });
