import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import type { Database as BunDatabase } from "bun:sqlite";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "app.db");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;

export function getAuth(): ReturnType<typeof betterAuth> {
  if (!_auth) {
    // Lazy require so bun:sqlite is never loaded in Node.js build workers
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Database } = require("bun:sqlite") as {
      Database: new (path: string, opts?: { create?: boolean }) => BunDatabase;
    };
    _auth = betterAuth({
      database: new Database(DB_PATH, { create: true }),
      emailAndPassword: { enabled: true, minPasswordLength: 1 },
      plugins: [nextCookies()],
    });
  }
  return _auth;
}
