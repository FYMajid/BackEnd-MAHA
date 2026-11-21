import express, { NextFunction, Request, Response } from "express";
import * as userService from "./service";
import { authenticateJWT } from "../../middleware/auth";

const router = express.Router();

router.get(
  "/me",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if req.user exists
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Now TypeScript knows req.user is defined
      const userId = req.user.id;

      // Fetch complete user data from database
      const completeUserData = await userService.getCurrentUser(userId);

      res.json({ message: "This is your profile", user: completeUserData });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
