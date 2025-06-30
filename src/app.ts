import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use("/api/v1/books", booksRouter(prisma));
app.use("/api/v1/books", reviewRouter(prisma));

export default app;
