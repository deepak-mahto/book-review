import { PrismaClient } from "@prisma/client";
import express from "express";
import booksRouter from "./routes/books";
import reviewRouter from "./routes/reviews";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.set("prisma", prisma);
app.use("/api/v1/books", booksRouter(prisma));
app.use("/api/v1/books", reviewRouter(prisma));

export default app;
