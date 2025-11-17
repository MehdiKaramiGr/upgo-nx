import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Roles
  const adminRole = await prisma.roles.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Full access role",
    },
  });

  const userRole = await prisma.roles.upsert({
    where: { name: "User" },
    update: {},
    create: {
      name: "User",
      description: "Normal user role",
    },
  });

  // Users
  const adminUser = await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password_hash: "hashedpassword", // replace with actual hashed password
      is_active: true,
      storageUsed: 0,
    },
  });

  // Assign roles
  await prisma.user_roles.createMany({
    data: [{ userId: adminUser.id, roleId: adminRole.id }],
    skipDuplicates: true,
  });

  // Optionally create a root folder for the admin
  await prisma.folders.create({
    data: {
      name: "Root",
      ownerId: adminUser.id,
    },
  });

  console.log("✅ Seed finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
