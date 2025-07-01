import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const reviewRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /books/{id}/reviews:
 *   get:
 *     summary: Get reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews
 */

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

/**
 * @swagger
 * /books/{id}/reviews:
 *   post:
 *     summary: Add a review to a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Review created
 */

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
