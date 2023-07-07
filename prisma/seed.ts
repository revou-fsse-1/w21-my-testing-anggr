import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@mail.com";

  await prisma.user.delete({ where: { email } }).catch(() => {});

  const hashedPassword = await bcrypt.hash("adminadmin", 10);
  await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
      lyric: `
 This is my first post

Isn't it great?
      `.trim(),
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
      lyric: `
 90s Mixtape

- I wish (Skee-Lo)

      `.trim(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
