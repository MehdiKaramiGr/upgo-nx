import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding started...");

  // ----------------------------------------------------
  // 1) ROLES
  // ----------------------------------------------------
  const adminRole = await prisma.roles.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Admin",
      description: "Full access role",
    },
  });

  const userRole = await prisma.roles.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "User",
      description: "Normal user role",
    },
  });

  console.log("✔ Roles seeded");

  // ----------------------------------------------------
  // 2) APP PAGES — using the ones already in DB
  // ----------------------------------------------------
  const pagesToSeed = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      description: "Overview of the whole system related to the current user",
      icon_name: null,
    },
    {
      id: 2,
      name: "Files",
      path: "/files",
      description:
        "The Dashboard view panel to manage all the files of the user",
      icon_name: null,
    },
    {
      id: 3,
      name: "User Panel",
      path: "/users",
      description: "manage users and their roles",
      icon_name: null,
    },
    {
      id: 4,
      name: "Shared files",
      path: "/files/shared",
      description: "manage files shared with user and user's file with others",
      icon_name: null,
    },
  ];

  for (const page of pagesToSeed) {
    await prisma.app_pages.upsert({
      where: { id: page.id },
      update: {},
      create: page,
    });
  }

  console.log("✔ App pages seeded");

  // ----------------------------------------------------
  // 3) ACCESS ACTIONS
  // ----------------------------------------------------
  const actionsToSeed = [
    {
      id: 1,
      name: "Invite People",
      description:
        "User can send invite to other user to be able to share file with them",
    },
    {
      id: 2,
      name: "Make files public",
      description: "User can make their files public",
    },
  ];

  for (const action of actionsToSeed) {
    await prisma.access_actions.upsert({
      where: { id: action.id },
      update: {},
      create: action,
    });
  }

  console.log("✔ Access actions seeded");

  // ----------------------------------------------------
  // 4) ADMIN ROLE SHOULD HAVE ACCESS TO ALL PAGES
  // ----------------------------------------------------
  const allPages = await prisma.app_pages.findMany();

  for (const page of allPages) {
    let exists = await prisma.role_page_access.count({
      where: {
        role_id: adminRole.id,
        page_id: page.id,
      },
    });
    if (exists == 0) {
      await prisma.role_page_access.create({
        data: {
          role_id: adminRole.id,
          page_id: page.id,
        },
      });
    }
  }

  console.log("✔ Admin granted ALL page access");

  // ----------------------------------------------------
  // 5) ADMIN ROLE SHOULD HAVE ACCESS TO ALL ACTIONS
  // ----------------------------------------------------
  const allActions = await prisma.access_actions.findMany();

  for (const action of allActions) {
    let exists = await prisma.role_action_access.count({
      where: {
        role_id: adminRole.id,
        action_id: action.id,
      },
    });
    if (exists == 0) {
      await prisma.role_action_access.create({
        data: {
          role_id: adminRole.id,
          action_id: action.id,
        },
      });
    }
  }

  console.log("✔ Admin granted ALL action access");

  console.log("🌱 Seed finished!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
