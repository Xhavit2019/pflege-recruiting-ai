import { createHash, randomBytes } from "crypto";

export function generatePasswordResetToken() {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashPasswordResetToken(token);

  return {
    token,
    tokenHash,
  };
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}
