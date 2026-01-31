import { CookieOptions } from "express";
import { refreshTokenMaxAgeMs } from "./auth";

const isProduction = process.env.NODE_ENV === "production";

export const refreshTokenCookieName = "refreshToken";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: refreshTokenMaxAgeMs,
};
