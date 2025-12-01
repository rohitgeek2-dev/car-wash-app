import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const TOKEN_NAME = "cw_token";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

// -----------------------------
// SIGN TOKEN (v9 compatible)
// -----------------------------
export function signToken(payload: Record<string, any>) {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

// -----------------------------
// VERIFY TOKEN (v9 compatible)
// -----------------------------
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
}
