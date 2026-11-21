import { prisma } from "../../lib/prisma";
import { UnauthorizedError } from "../../error/UnauthorizedError";

export const getCurrentUser = async (userId: string) => {
  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      address: true,
      role: true,
      position: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
};
