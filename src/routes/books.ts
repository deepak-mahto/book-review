import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import Redis from "ioredis";

const booksRouter = Router();

const CACHE_EXPIRATION = 60;

booksRouter.get("/", async (req, res) => {
  const prisma = req.app.get("prisma") as PrismaClient;
  const redis = req.app.get("redis") as Redis;

  try {
    const cachedBooks = await redis.get("allBooks");

    if (cachedBooks) {
      res.json(JSON.parse(cachedBooks));
      return;
    }

    const books = await prisma.book.findMany();

    try {
      await redis.set(
        "allBooks",
        JSON.stringify(books),
        "EX",
        CACHE_EXPIRATION
      );
    } catch (cacheError) {
      console.error("Cache write error:", cacheError);
    }

    res.json({
      books,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

booksRouter.post("/", async (req, res) => {
  const prisma = req.app.get("prisma") as PrismaClient;
  const { title, author } = req.body;

  if (!title || !author) {
    res.status(400).json({
      message: "Title and Author are required",
    });
    return;
  }

  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
      },
    });

    res.json({
      newBook,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

export default (prisma: PrismaClient, redis: Redis) => {
  const routerWithDeps = booksRouter;
  routerWithDeps.use((req, _, next) => {
    req.app.set("prisma", prisma);
    req.app.set("redis", redis);
    next();
  });
  return routerWithDeps;
};
