import { PrismaClient } from "@prisma/client";
import express from "express";
import booksRouter from "./routes/books";
import reviewRouter from "./routes/reviews";
import Redis from "ioredis";
import { error } from "console";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis:localhost:6379");

redis.on("error", () => {
  console.error("Redis connection error", error);
});

const app = express();
app.use(express.json());

app.set("prisma", prisma);
app.set("redis", redis);
app.use("/api/v1/books", booksRouter(prisma, redis));
app.use("/api/v1/books", reviewRouter(prisma));

export default app;
