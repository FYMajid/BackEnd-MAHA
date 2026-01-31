import express, { NextFunction, Request, Response } from "express";
import * as userService from "./service";
import * as authService from "../auth/service";
import { createUserSchema, loginSchema, updateUserSchema } from "./schema";
import {
  refreshTokenCookieName,
  refreshTokenCookieOptions,
} from "../../lib/cookies";

const router = express.Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createUserSchema.parse(req.body);
      const user = await userService.createUser(dto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(
        dto.email,
        dto.password,
        req.ip,
      );
      res.cookie(
        refreshTokenCookieName,
        result.refreshToken,
        refreshTokenCookieOptions,
      );
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.query.organizationId;
    if (organizationId) {
      const users = await userService.getUsersByOrg(
        BigInt(String(organizationId)),
      );
      res.json(users);
      return;
    }
    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = BigInt(String(req.params.id));
    const dto = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(id, dto);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = BigInt(String(req.params.id));
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
