import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const booksRouter = Router();

booksRouter.get("/", async (req, res) => {
  const prisma = req.app.get("prisma") as PrismaClient;

  try {
    const books = await prisma.book.findMany();

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

export default (prisma: PrismaClient) => {
  const routerWithDeps = booksRouter;
  routerWithDeps.use((req, _, next) => {
    req.app.set("prisma", prisma);
    next();
  });
  return routerWithDeps;
};
