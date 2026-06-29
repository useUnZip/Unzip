import crypto from "crypto";

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// Generates an UnZip API key shown to the user exactly once.
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const raw = crypto.randomBytes(24).toString("base64url");
  const key = `unzip_${raw}`;
  return { key, hash: hashApiKey(key), prefix: key.slice(0, 12) };
}

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}
