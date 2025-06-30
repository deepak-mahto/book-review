import { PrismaClient } from "@prisma/client";
import express from "express";
import booksRouter from "./routes/books";
import reviewRouter from "./routes/reviews";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.set("prisma", prisma);
app.use("/api/v1/books", booksRouter(prisma));
app.use("/api/v1/books", reviewRouter(prisma));

export default app;
