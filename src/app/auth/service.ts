import { prisma } from "../../lib/prisma";
import { LoginUser, RegisterUser } from "./dto";
import bcrypt from "bcrypt";
import { BadRequestError } from "../../error/BadRequestError";
import jwt from "jsonwebtoken";
import { Position, Role } from "@prisma/client";

export const registerUser = async (data: RegisterUser) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    password,
    position,
    role,
  } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }],
    },
  });

  if (existing) {
    throw new Error("Email atau nomor sudah terdaftar");
  }

  const user = await prisma.user.create({
    data: {
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      position: position as Position,
      role: role as Role,
    },
  });

  return user;
};

export const loginUser = async ({ email, password }: LoginUser) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new BadRequestError("Invalid email or password");

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      position: user.position,
      role: user.role,
    },
  };
};
