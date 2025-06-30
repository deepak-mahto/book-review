import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.get("/:id/reviews", async (req, res) => {
  const prisma = req.app.get("prisma") as PrismaClient;
  const bookId = parseInt(req.params.id);

  try {
    const reviews = await prisma.review.findMany({
      where: {
        bookId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      reviews,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

reviewRouter.post("/:id/reviews", async (req, res) => {
  const prisma = req.app.get("prisma") as PrismaClient;
  const bookId = parseInt(req.params.id);

  const { content, rating } = req.body;

  if (!content || rating === undefined) {
    res.status(400).json({
      message: "Content and rating are required",
    });
    return;
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        bookId,
      },
    });

    res.status(201).json({
      newReview,
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
  const routerWithDeps = reviewRouter;
  routerWithDeps.use((req, _, next) => {
    req.app.set("prisma", prisma);
    next();
  });
  return routerWithDeps;
};
