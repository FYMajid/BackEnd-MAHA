import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function seedRoles() {
  await prisma.role.createMany({
    data: [{ name: "ADMIN" }, { name: "SUPERADMIN" }],
    skipDuplicates: true,
  });
}

async function seedUsers(orgId: bigint) {
  const passwordHash = await bcrypt.hash("password123", 10);

  const roles = await prisma.role.findMany();

  const map: Record<string, bigint> = {};
  roles.forEach((r) => (map[r.name] = r.id));

  const admin = await prisma.user.create({
    data: {
      organizationId: orgId,
      name: "Admin",
      email: "admin@mail.com",
      passwordHash,
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      organizationId: orgId,
      name: "Super Admin",
      email: "super@mail.com",
      passwordHash,
    },
  });

  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: map.ADMIN },
      { userId: superAdmin.id, roleId: map.SUPERADMIN },
    ],
  });
}

async function main() {
  await seedRoles();

  const org = await prisma.organization.create({
    data: { name: "Default Org" },
  });

  await seedUsers(org.id);

  console.log("seed complete");
}

main()
  .catch((error) => {
    console.error("seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
