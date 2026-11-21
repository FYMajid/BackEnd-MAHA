import express, { NextFunction, Request, Response } from "express";
import { uploadDocumentFile } from "../../middleware/upload";
import {
  createDepositAction,
  createInvoice,
  createPaymentProof,
  deleteDepositAccount,
  deleteInvoice,
  deletePaymentProof,
  getAllDepositAccounts,
  getAllInvoices,
  getAllPaymentProofs,
  getDepositAccountById,
  getInvoiceById,
  getPaymentProofById,
  updateDepositAccount,
  updateInvoice,
  updatePaymentProof,
} from "./service";

const router = express.Router();

router.get("/invoices", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAllInvoices({
      search: req.query.search as string | undefined,
      status: req.query.status as string | undefined,
      clientId: req.query.clientId as string | undefined,
      matterId: req.query.matterId as string | undefined,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/invoices/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await getInvoiceById(req.params.id);
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/invoices", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await createInvoice(req.body);
    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/invoices/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await updateInvoice(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        message: "Invoice updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/invoices/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await deleteInvoice(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Invoice deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/payment-proofs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getAllPaymentProofs({
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        invoiceId: req.query.invoiceId as string | undefined,
      });

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/payment-proofs/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await getPaymentProofById(req.params.id);
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/payment-proofs",
  uploadDocumentFile.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const data = await createPaymentProof(req.body, fileUrl);
      res.status(201).json({
        status: "success",
        message: "Payment proof created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/payment-proofs/:id",
  uploadDocumentFile.single("file"),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const data = await updatePaymentProof(req.params.id, req.body, fileUrl);
      res.status(200).json({
        status: "success",
        message: "Payment proof updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/payment-proofs/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await deletePaymentProof(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Payment proof deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get("/deposits", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getAllDepositAccounts({
      search: req.query.search as string | undefined,
      clientId: req.query.clientId as string | undefined,
      matterId: req.query.matterId as string | undefined,
    });

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/deposits/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await getDepositAccountById(req.params.id);
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/deposits", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await createDepositAction(req.body);
    res.status(201).json({
      status: "success",
      message: "Deposit transaction processed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/deposits/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const data = await updateDepositAccount(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        message: "Deposit account updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/deposits/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await deleteDepositAccount(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Deposit account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
