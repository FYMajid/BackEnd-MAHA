import express, { NextFunction, Request, Response } from "express";
import {
  createCostJournal,
  deleteCostJournal,
  getAllCostJournals,
  getCostJournalById,
  updateCostJournal,
} from "./service";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journals = await getAllCostJournals({
      search: req.query.search as string | undefined,
      type: req.query.type as string | undefined,
      billingType: req.query.billingType as string | undefined,
      matterId: req.query.matterId as string | undefined,
    });

    res.status(200).json({
      status: "success",
      data: journals,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const journal = await getCostJournalById(req.params.id);
      res.status(200).json({
        status: "success",
        data: journal,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await createCostJournal(req.body);
    res.status(201).json({
      status: "success",
      message: "Cost journal created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const updated = await updateCostJournal(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        message: "Cost journal updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await deleteCostJournal(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Cost journal deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
