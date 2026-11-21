import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
const SECRET_KEY = process.env.JWT_SECRET || "secretkey";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    // 🔥 ambil data lengkap dari DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        position: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 🔥 sekarang type cocok 100%
    req.user = user;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
