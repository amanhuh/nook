# Nook Architecture & Technical Overview

This document outlines the system architecture, authentication flow, data models, and technical patterns powering Nook.

---

## 1. System Architecture Overview

Nook is built on the **Next.js 16 App Router** using serverless API route handlers and MongoDB Atlas for persistence.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Browser)                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                       │
│                     (src/proxy.ts)                          │
│        Verifies JWT cookies & handles route redirects        │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────┐              ┌──────────────────────┐
│   App Router Pages   │              │  Serverless API      │
│ (/home, /library)    │              │  (/api/books, etc.)  │
└──────────────────────┘              └──────────┬───────────┘
                                                 │
                                                 ▼
                                      ┌──────────────────────┐
                                      │    MongoDB Atlas     │
                                      │   (Mongoose ODM)     │
                                      └──────────────────────┘
```

---

## 2. Authentication & Route Protection Flow

Authentication uses stateless **JSON Web Tokens (JWT)** stored in secure HTTP-only cookies (`auth_token`).

### Authentication Lifecycle:
1. **User Sign In / Sign Up**:
   - Client posts credentials to `/api/auth/signin` or `/api/auth/signup`.
   - Credentials are validated using Zod schemas (`signInSchema` / `signUpSchema`).
   - Passwords are hashed using `bcryptjs` (salt factor 12).
   - Upon verification, a JWT payload containing the user's ID is signed using `jose` and set in an HTTP-only cookie.

2. **Route Protection (`src/proxy.ts` / `src/middleware.ts`)**:
   - Protected routes (`/home`, `/library`, `/lists`, `/books`) are intercepted before rendering.
   - If an invalid or missing token is detected, the user is redirected to `/sign-in?from=<path>`.
   - Authenticated users visiting `/sign-in` or `/sign-up` are automatically forwarded to `/home`.

3. **API Endpoint Verification**:
   - API endpoints inspect the `auth_token` cookie via `verifyToken(token)`.
   - Requests lacking valid authentication receive a `401 Unauthorized` response.

---

## 3. Database & Data Models

Database connections are managed via Mongoose with cached connection handling to prevent connection pool exhaustion during serverless function invocations (`src/lib/db.ts`).

### Entity Relationship Diagram (ERD)

```
┌──────────────────┐           1 : N           ┌──────────────────┐
│       User       ├──────────────────────────►│       Book       │
│ ---------------- │                           │ ---------------- │
│ _id              │                           │ _id              │
│ name             │                           │ userId (Ref)     │
│ email            │                           │ title            │
│ passwordHash     │                           │ authors          │
└────────┬─────────┘                           │ status           │
         │                                     └──────────────────┘
         │ 1 : N                                         ▲
         ▼                                               │ Ref (M:N via ListBook)
┌──────────────────┐                                     │
│       List       │                                     │
│ ---------------- │                                     │
│ _id              │                                     │
│ userId (Ref)     │                                     │
│ name             │                                     │
│ color            │                                     │
│ books [{bookId}] ├─────────────────────────────────────┘
└──────────────────┘
```

### Schema Definitions:

#### **User Schema (`src/models/User.ts`)**
- `_id`: `ObjectId` (Primary Key)
- `name`: `String` (Required)
- `email`: `String` (Required, Unique, Lowercase)
- `passwordHash`: `String` (Selectable: false by default)
- `timestamps`: `createdAt`, `updatedAt`

#### **Book Schema (`src/models/Book.ts`)**
- `_id`: `ObjectId` (Primary Key)
- `userId`: `ObjectId` (Index, Reference to User)
- `title`: `String` (Required)
- `authors`: `[String]`
- `coverUrl`: `String`
- `status`: `Enum` (`"READING" | "COMPLETED" | "WANT_TO_READ"`)
- `rating`: `Number` (Optional, 1-5)
- `pageCount`: `Number` (Optional)
- `googleBooksId`: `String` (Optional)
- `timestamps`: `createdAt`, `updatedAt`

#### **List Schema (`src/models/List.ts`)**
- `_id`: `ObjectId` (Primary Key)
- `userId`: `ObjectId` (Index, Reference to User)
- `name`: `String` (Required)
- `color`: `String` (Hex color string)
- `books`: `[{ bookId: ObjectId, addedAt: Date }]` (Array of nested book references)
- `timestamps`: `createdAt`, `updatedAt`

---
