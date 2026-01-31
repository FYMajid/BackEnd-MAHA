import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../error/http";
import {
  getExpiryDateFromToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/auth";

const userSelect = {
  id: true,
  organizationId: true,
  name: true,
  email: true,
  hourlyRate: true,
  isActive: true,
  createdAt: true,
  roles: {
    select: {
      role: true,
    },
  },
};

export const login = async (
  email: string,
  password: string,
  ipAddress?: string,
) => {
  await prisma.session.deleteMany({
    where: { expiredAt: { lt: new Date() } },
  });

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      organizationId: true,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({
    sub: user.id.toString(),
    orgId: user.organizationId.toString(),
  });
  const refreshToken = signRefreshToken({
    sub: user.id.toString(),
  });

  const tokenHash = hashToken(refreshToken);
  const expiredAt = getExpiryDateFromToken(refreshToken);

  await prisma.$transaction([
    prisma.session.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiredAt: expiredAt ?? undefined,
      },
    }),
    prisma.loginLog.create({
      data: {
        userId: user.id,
        ipAddress,
      },
    }),
  ]);

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: userSelect,
  });

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

export const refresh = async (refreshToken: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new HttpError(401, "Invalid refresh token");
  }
  const tokenHash = hashToken(refreshToken);

  await prisma.session.deleteMany({
    where: { expiredAt: { lt: new Date() } },
  });

  const session = await prisma.session.findFirst({
    where: { token: tokenHash },
  });

  if (!session) {
    throw new HttpError(401, "Invalid refresh token");
  }

  if (session.expiredAt && session.expiredAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    throw new HttpError(401, "Refresh token expired");
  }

  const userId = payload.sub ? BigInt(String(payload.sub)) : null;
  if (!userId) {
    throw new HttpError(401, "Invalid refresh token");
  }
  if (session.userId !== userId) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    throw new HttpError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid refresh token");
  }

  const newRefreshToken = signRefreshToken({ sub: user.id.toString() });
  const newTokenHash = hashToken(newRefreshToken);
  const newExpiredAt = getExpiryDateFromToken(newRefreshToken);

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { id: session.id } }),
    prisma.session.create({
      data: {
        userId: user.id,
        token: newTokenHash,
        expiredAt: newExpiredAt ?? undefined,
      },
    }),
  ]);

  const accessToken = signAccessToken({
    sub: user.id.toString(),
    orgId: user.organizationId.toString(),
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  await prisma.session.deleteMany({ where: { token: tokenHash } });
};
