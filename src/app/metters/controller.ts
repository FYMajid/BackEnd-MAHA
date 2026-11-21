import express, { NextFunction, Request, Response } from "express";
import { MatterService } from "./service";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matters = await MatterService.getAllMatters();
    res.json(matters);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const matter = await MatterService.getMatterById(req.params.id);
      if (!matter) return res.status(404).json({ message: "Not found" });
      res.json(matter);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matter = await MatterService.createMatter(req.body);
    res.status(201).json(matter);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const matter = await MatterService.updateMatter(req.params.id, req.body);
      res.json(matter);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await MatterService.deleteMatter(req.params.id);
      res.json({ message: "Matter deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

/**
 * @swagger
 * /matter:
 *   get:
 *     summary: Get all matters
 *     tags: [Matters]
 *     responses:
 *       200:
 *         description: List of matters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Matter'
 */

/**
 * @swagger
 * /matters:
 *   post:
 *     summary: Create new matter
 *     tags: [Matters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatterDTO'
 *     responses:
 *       201:
 *         description: Matter created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Matter'
 */

/**
 * @swagger
 * /matters/{id}:
 *   get:
 *     summary: Get matter detail by id
 *     tags: [Matters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matter detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Matter'
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /matters/{id}:
 *   put:
 *     summary: Update matter
 *     tags: [Matters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatterDTO'
 *     responses:
 *       200:
 *         description: Matter updated
 */

/**
 * @swagger
 * /matters/{id}:
 *   delete:
 *     summary: Delete matter
 *     tags: [Matters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matter deleted
 */
