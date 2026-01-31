import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function seedRoles() {
  await prisma.role.createMany({
    data: [{ name: "ADMIN" }, { name: "SUPERADMIN" }],
    skipDuplicates: true,
  });
}

async function seedPermissions() {
  const resources = [
    "users",
    "organizations",
    "roles",
    "permissions",
    "user-roles",
    "role-permissions",
    "sessions",
    "login-logs",
    "contact-types",
    "contacts",
    "contact-details",
    "matters",
    "matter-members",
    "matter-parties",
    "tasks",
    "calendar-events",
    "documents",
    "document-versions",
    "time-entries",
    "expenses",
    "invoices",
    "invoice-items",
    "payments",
    "bank-accounts",
    "activity-logs",
    "notifications",
  ];
  const actions = ["create", "read", "update", "delete"];

  const codes = resources.flatMap((resource) =>
    actions.map((action) => `${resource}.${action}`),
  );

  await prisma.permission.createMany({
    data: codes.map((code) => ({ code })),
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  const roleMap: Record<string, bigint> = {};
  roles.forEach((role) => (roleMap[role.name] = role.id));

  const rolePermissionData = permissions.flatMap((permission) => [
    {
      roleId: roleMap.ADMIN,
      permissionId: permission.id,
    },
    {
      roleId: roleMap.SUPERADMIN,
      permissionId: permission.id,
    },
  ]);

  await prisma.rolePermission.createMany({
    data: rolePermissionData,
    skipDuplicates: true,
  });
}

async function seedUsers(orgId: bigint) {
  const passwordHash = await bcrypt.hash("password123", 12);

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
  await seedPermissions();

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
