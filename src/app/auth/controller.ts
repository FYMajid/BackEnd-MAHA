import express, { NextFunction, Request, Response } from "express";
import * as authService from "./service";
import {
  refreshTokenCookieName,
  refreshTokenCookieOptions,
} from "../../lib/cookies";

const router = express.Router();

const getRefreshTokenFromRequest = (req: Request) => {
  const tokenFromCookie = req.cookies?.[refreshTokenCookieName];
  if (tokenFromCookie) {
    return String(tokenFromCookie);
  }
  if (req.body?.refreshToken) {
    return String(req.body.refreshToken);
  }
  return "";
};

router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token required",
        });
        return;
      }

      const result = await authService.refresh(refreshToken);
      res.cookie(
        refreshTokenCookieName,
        result.refreshToken,
        refreshTokenCookieOptions,
      );
      res.json({ accessToken: result.accessToken });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = getRefreshTokenFromRequest(req);
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
