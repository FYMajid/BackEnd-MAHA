import "./types/express";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error";
import { logger } from "./middleware/logger";
import { notFoundHandler } from "./middleware/not-found";
import { authMiddleware } from "./middleware/auth";
import { permissionGuard } from "./middleware/permission";
import { apiLimiter, authLimiter } from "./middleware/rate-limit";
import userController from "./app/user/controller";
import authController from "./app/auth/controller";
import organizationController from "./app/organization/controller";
import roleController from "./app/role/controller";
import permissionController from "./app/permission/controller";
import userRoleController from "./app/user-role/controller";
import rolePermissionController from "./app/role-permission/controller";
import sessionController from "./app/session/controller";
import loginLogController from "./app/login-log/controller";
import contactTypeController from "./app/contact-type/controller";
import contactController from "./app/contact/controller";
import contactDetailController from "./app/contact-detail/controller";
import matterController from "./app/matter/controller";
import matterMemberController from "./app/matter-member/controller";
import matterPartyController from "./app/matter-party/controller";
import taskController from "./app/task/controller";
import calendarEventController from "./app/calendar-event/controller";
import documentController from "./app/document/controller";
import documentVersionController from "./app/document-version/controller";
import timeEntryController from "./app/time-entry/controller";
import expenseController from "./app/expense/controller";
import invoiceController from "./app/invoice/controller";
import invoiceItemController from "./app/invoice-item/controller";
import paymentController from "./app/payment/controller";
import bankAccountController from "./app/bank-account/controller";
import activityLogController from "./app/activity-log/controller";
import notificationController from "./app/notification/controller";
import { swaggerSpec } from "./lib/swagger";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.disable("x-powered-by");

// middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(logger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
}); 

app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/auth/refresh", authLimiter);
app.use("/api/auth/logout", authLimiter);

app.use("/api", apiLimiter);
app.use("/api", authMiddleware);
app.use("/api", permissionGuard);

app.use("/api/users", userController);
app.use("/api/auth", authController);
app.use("/api/organizations", organizationController);
app.use("/api/roles", roleController);
app.use("/api/permissions", permissionController);
app.use("/api/user-roles", userRoleController);
app.use("/api/role-permissions", rolePermissionController);
app.use("/api/sessions", sessionController);
app.use("/api/login-logs", loginLogController);
app.use("/api/contact-types", contactTypeController);
app.use("/api/contacts", contactController);
app.use("/api/contact-details", contactDetailController);
app.use("/api/matters", matterController);
app.use("/api/matter-members", matterMemberController);
app.use("/api/matter-parties", matterPartyController);
app.use("/api/tasks", taskController);
app.use("/api/calendar-events", calendarEventController);
app.use("/api/documents", documentController);
app.use("/api/document-versions", documentVersionController);
app.use("/api/time-entries", timeEntryController);
app.use("/api/expenses", expenseController);
app.use("/api/invoices", invoiceController);
app.use("/api/invoice-items", invoiceItemController);
app.use("/api/payments", paymentController);
app.use("/api/bank-accounts", bankAccountController);
app.use("/api/activity-logs", activityLogController);
app.use("/api/notifications", notificationController);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
