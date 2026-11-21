import { Router } from "express";
import authController from "../app/auth/contoller";
import userController from "../app/user/controller";
import contactController from "../app/contact/controller";
import documentController from "../app/documents/controller";
import mettersController from "../app/metters/controller";
import eventsController from "../app/events/controller";
import costJournalController from "../app/cost-journal/controller";
import transactionsController from "../app/transactions/controller";

const router = Router();

router.use("/auth", authController);
router.use("/user", userController);
router.use("/contact", contactController);
router.use("/document", documentController);
router.use("/metter", mettersController);
router.use("/events", eventsController);
router.use("/cost-journal", costJournalController);
router.use("/transactions", transactionsController);

export default router;
