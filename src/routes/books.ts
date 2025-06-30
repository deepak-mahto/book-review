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
    res.status(500).json({
      error: error,
    });
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
    await prisma.book.create({
      data: {
        title,
        author,
      },
    });

    res.json({
      message: "Added a new book",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

export default booksRouter;
