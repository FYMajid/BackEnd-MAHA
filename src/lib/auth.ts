import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import ms, { StringValue } from "ms";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as StringValue;
const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as StringValue;

const requireSecret = (secret: string | undefined, name: string) => {
  if (!secret) {
    throw new Error(`${name} is not set`);
  }
  return secret;
};

export const signAccessToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, requireSecret(accessSecret, "JWT_ACCESS_SECRET"), {
    expiresIn: accessExpiresIn,
  });

export const signRefreshToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, requireSecret(refreshSecret, "JWT_REFRESH_SECRET"), {
    expiresIn: refreshExpiresIn,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, requireSecret(accessSecret, "JWT_ACCESS_SECRET")) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, requireSecret(refreshSecret, "JWT_REFRESH_SECRET")) as JwtPayload;

export const decodeToken = (token: string) => jwt.decode(token) as JwtPayload | null;

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const refreshTokenMaxAgeMs = (() => {
  const value = ms(refreshExpiresIn);
  if (typeof value !== "number") {
    return 7 * 24 * 60 * 60 * 1000;
  }
  return value;
})();

export const getExpiryDateFromToken = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) {
    return null;
  }
  return new Date(decoded.exp * 1000);
};

export const accessTokenConfig = {
  expiresIn: accessExpiresIn,
};

export const refreshTokenConfig = {
  expiresIn: refreshExpiresIn,
};
