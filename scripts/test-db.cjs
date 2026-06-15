require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");

const p = new PrismaClient();
p.submission
  .count()
  .then((n) => {
    console.log("OK — povezava deluje, vrstic v submissions:", n);
  })
  .catch((e) => {
    console.error("FAIL —", e.message);
    process.exitCode = 1;
  })
  .finally(() => p.$disconnect());
