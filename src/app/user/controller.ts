import express, { NextFunction, Request, Response } from "express";
import * as userService from "./service";
import { createUserSchema, updateUserSchema } from "./schema";

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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.json(result);
      } catch (error) {
        next(error);
      }
    };
  },
);

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
