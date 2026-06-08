import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function seedUsers() {
  const passwordHash = await bcrypt.hash("password123", 10);

  for (let i = 0; i < 30; i++) {
    await prisma.users.create({
      data: {
        username: faker.internet.username(),
        full_Name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        photo_profile: faker.image.avatar(),
        bio: faker.person.bio(),
      },
    });
  }
}

async function seedThreads() {
  const users = await prisma.users.findMany();

  if (!users.length) {
    throw new Error("No users found");
  }

  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;

    await prisma.threads.create({
      data: {
        content: faker.lorem.paragraph(),
        image: Math.random() > 0.5 ? faker.image.urlPicsumPhotos() : null,
        userId: user.id,
      },
    });
  }
}

async function seedReplies() {
  const users = await prisma.users.findMany();
  const threads = await prisma.threads.findMany();

  if (!users.length || !threads.length) {
    throw new Error("No users or threads found");
  }

  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)!];
    const thread = threads[Math.floor(Math.random() * threads.length)!];

    if (!user || !thread) {
      console.warn("Skipping reply creation due to missing user or thread");
      continue;
    }

    // await prisma.replies.create({
    //   data: {
    //     content: faker.lorem.sentence(),
    //     image: Math.random() > 0.5 ? faker.image.urlPicsumPhotos() : null,
    //     userId: user.id,
    //     threadId: thread.id,
    //   },
    // });

    // console.log("USER:", user?.id);
    // console.log("THREAD:", thread?.id);

    await prisma.replies.create({
      data: {
        content: faker.lorem.sentence(),
        image: Math.random() > 0.5 ? faker.image.urlPicsumPhotos() : null,
        userId: user.id,
        threadId: thread.id,
      },
    });
  }
}

async function seedLikes() {
  const users = await prisma.users.findMany();
  const threads = await prisma.threads.findMany();

  if (!users.length || !threads.length) {
    throw new Error("No users or threads found");
  }

  const created = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;
    const thread = threads[Math.floor(Math.random() * threads.length)]!;

    const key = `${thread.id}-${user.id}`;

    if (created.has(key)) continue;

    created.add(key);

    await prisma.likes.create({
      data: {
        userId: user.id,
        threadId: thread.id,
      },
    });
  }
}

async function seedFollowing() {
  const users = await prisma.users.findMany();

  if (!users.length) {
    throw new Error("No users found");
  }

  const created = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const following = users[Math.floor(Math.random() * users.length)]!;
    const follower = users[Math.floor(Math.random() * users.length)]!;

    if (following.id === follower.id) continue;

    const key = `${following.id}-${follower.id}`;

    if (created.has(key)) continue;

    created.add(key);

    await prisma.following.create({
      data: {
        followingId: following.id,
        followerId: follower.id,
      },
    });
  }
}

async function main() {
  // await seedUsers();
  // await seedThreads();
  await seedReplies();
  // await seedLikes();
  // await seedFollowing();
  // const count = await prisma.users.count();
  // console.log("Existing users count:", count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
