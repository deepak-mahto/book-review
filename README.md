# Book Review Service API

![Node.js 18.x](https://img.shields.io/badge/Node.js-18-green)
![TypeScript 5.x](https://img.shields.io/badge/TypeScript-5-blue)
![Express 4.x](https://img.shields.io/badge/Express-4-lightgrey)
![Prisma 5.x](https://img.shields.io/badge/Prisma-5-darkblue)
![PostgreSQL 15.x](https://img.shields.io/badge/PostgreSQL-15-blue)

RESTful API service for managing books and their reviews. Built with TypeScript, Express, and Prisma ORM. Provides robust endpoints for book management and review operations with comprehensive API documentation.

## Features

- **Book Management**: Create and retrieve books with title/author metadata
- **Review System**: Add reviews to books and fetch book reviews
- **Type Safety**: Full TypeScript support with strict typing
- **RESTful Design**: Clean, predictable API endpoints
- **Database Migrations**: Prisma-based schema management
- **API Documentation**: Interactive Swagger UI with OpenAPI spec
- **Error Handling**: Comprehensive error responses and validation

## Technology Stack

| Component         | Technology |
| ----------------- | ---------- |
| Runtime           | Node.js    |
| Language          | TypeScript |
| Web Framework     | Express    |
| ORM               | Prisma     |
| Database          | PostgreSQL |
| API Documentation | Swagger UI |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Installation

1. Clone the repository:

```bash
git clone git@github.com:deepak-mahto/book-review.git

cd book-review
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

```bash
cp .env.example .env
```

Edit `.env` with your postgreSQL credentials:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/bookreview?schema=public"
PORT=3000
```

4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

### Running the Service

Start the development server:

```bash
npm run dev
```

API will be available at `http:localhost:3000`

## API Documentation

Interactive documentation available via Swagger UI:

`http://localhost:3000/api-docs`

![Screenshot of swagger UI](./img/book-review-service.png)

### Example Requests

Create a Book

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The TypeScript Handbook", "author": "Sara Developer"}'
```

Response:

```bash
{
  "id": 1,
  "title": "The TypeScript Handbook",
  "author": "Sara Developer",
  "createdAt": "2023-10-15T12:34:56.789Z"
}
```

Add a Review

```bash
curl -X POST http://localhost:3000/api/v1/books/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"content": "Excellent resource for TS best practices", "rating": 5}'
```

Response:

```bash
{
  "id": 1,
  "content": "Excellent resource for TS best practices",
  "rating": 5,
  "bookId": 1,
  "createdAt": "2023-10-15T12:35:47.123Z"
}
```

Get Book Reviews

```bash
curl http://localhost:3000/api/v1/books/1/reviews
```

Response:

```bash
[
  {
    "id": 1,
    "content": "Excellent resource for TS best practices",
    "rating": 5,
    "bookId": 1,
    "createdAt": "2023-10-15T12:35:47.123Z"
  }
]
```

## Database Schema

```prisma
model Book {
  id        Int      @id @default(autoincrement())
  title     String
  author    String
  createdAt DateTime @default(now())
  reviews   Review[]
}

model Review {
  id        Int      @id @default(autoincrement())
  content   String
  rating    Int
  bookId    Int
  book      Book     @relation(fields: [bookId], references: [id])
  createdAt DateTime @default(now())

  @@index([bookId])
}
```

## Project Structure

```text
book-review/
├── src/
│   ├── app.ts                 # Express application setup
│   ├── index.ts               # Server entry point
│   ├── routes/
│   │   ├── books.ts           # Book routes
│   │   └── reviews.ts         # Review routes
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example               # Environment template
├── package.json
└── tsconfig.json              # TypeScript config
```

### Service is live at

```bash
https://book-review-vxxs.onrender.com
```
