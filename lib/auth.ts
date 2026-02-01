import jwt from "jsonwebtoken";

export type AdminTokenPayload = {
  adminId: number;
  email: string;
  name: string;
};

export function signAdminToken(payload: AdminTokenPayload) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET!;
    return jwt.verify(token, secret) as AdminTokenPayload;
  } catch {
    return null;
  }
}
