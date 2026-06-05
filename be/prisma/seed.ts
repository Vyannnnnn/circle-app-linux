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

  if (users.length === 0) {
    throw new Error(
      "No users found. Please seed users before seeding threads.",
    );
  }

  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;

    await prisma.threads.create({
      data: {
        content: faker.lorem.paragraph(),
        image: Math.random() > 0.5 ? faker.image.urlPicsumPhotos() : "",
        createdBy: user.username,
        updatedBy: user.username,
      },
    });
  }
}

async function seedReplies() {
  const users = await prisma.users.findMany();
  const threads = await prisma.threads.findMany();

  if (users.length === 0 || threads.length === 0) {
    throw new Error(
      "No users or threads found. Please seed users and threads before seeding replies.",
    );
  }

  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;
    const thread = threads[Math.floor(Math.random() * threads.length)]!;

    await prisma.replies.create({
      data: {
        userId: user.id,
        threadId: thread.id,
        content: faker.lorem.sentence(),
        image: Math.random() > 0.5 ? faker.image.urlPicsumPhotos() : "",
        createdBy: user.username,
        updatedBy: user.username,
      },
    });
  }
}

async function seedLikes() {
  const users = await prisma.users.findMany();
  const threads = await prisma.threads.findMany();

  if (users.length === 0 || threads.length === 0) {
    throw new Error(
      "No users or threads found. Please seed users and threads before seeding likes.",
    );
  }

  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;
    const thread = threads[Math.floor(Math.random() * threads.length)]!;

    await prisma.likes.create({
      data: {
        userId: user.id,
        threadId: thread.id,
        createdBy: user.username,
        updatedBy: user.username,
      },
    });
  }
}

async function seedFollowing() {
  const users = await prisma.users.findMany();

  if (users.length === 0) {
    throw new Error(
      "No users found. Please seed users before seeding following relationships.",
    );
  }

  for (let i = 0; i < 30; i++) {
    const following = users[Math.floor(Math.random() * users.length)]!;
    let follower = users[Math.floor(Math.random() * users.length)]!;
    const created = new Set<string>();

    if (follower.id === following.id) continue;

    const key = `${following.id}-${follower.id}`;
    if (created.has(key)) continue;
    created.add(key);

    const existing = await prisma.following.findFirst({
      where: {
        followingId: follower.id,
        followerId: following.id,
      },
    });

    if (existing) continue;

    await prisma.following.create({
      data: {
        followingId: following.id,
        followerId: follower.id,
      },
    });
  }
}

async function main() {
  //   await seedUsers();
  //   await seedThreads();
  //   await seedReplies();
  //   await seedLikes();
  await seedFollowing();
  const count = await prisma.users.count();
  console.log("Existing users count:", count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
