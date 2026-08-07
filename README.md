<div align="center">
  <img src="./public/nook-logo.svg" alt="Nook Logo" width="80" height="80" />
  <h1>Nook</h1>
  <p><strong>Your personal reading corner. Beautifully organized.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#environment-variables">Environment Variables</a> •
    <a href="#project-structure">Project Structure</a>
  </p>
</div>

---

## About Nook

Nook is a modern, minimal, editorial web application designed for readers who appreciate refined design and seamless organization. Track your reading progress, curate custom collections with custom theme colors, search books via the Google Books API, and enjoy an immersive landing page built with realistic 3D book spine tilt physics.

---

## Features

- **Intuitive & Comfortable Editorial Design**: Crafted with warm ambient glows, curated editorial typography, subtle micro-animations, and a distraction-free layout designed for comfortable extended use.
- **Perceivable Performance & Skeleton Loaders**: Fluid, flicker-free state transitions using custom skeleton components to eliminate Cumulative Layout Shift (CLS).
- **Personal Library Management**: Organize books across status categories—**Reading**, **Completed**, and **Want to Read**.
- **Custom Collections & Lists**: Create and manage custom book lists with dynamic color pickers, ambient header glows, and multi-select book management.
- **Google Books API Integration**: Search millions of titles and import metadata (covers, authors, page counts) directly into your library.
- **Responsive 3-Tier Navigation**: Features a dynamic 3-tier sidebar (`w-16` / `lg:w-38` / `xl:w-64`) on desktop/tablets and an auto-hiding mobile bottom navigation bar.
- **Secure Authentication**: Built with JWT HTTP-only cookies, password hashing via `bcryptjs`, and automated route protection.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI Library & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database & ODM** | [MongoDB Atlas](https://www.mongodb.com/atlas), [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Jose](https://github.com/panva/jose) (JWT), [BcryptJS](https://github.com/dcodeIO/bcrypt.js) |
| **Icons & Animations** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Form Validation** | [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.si/) |

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **Package Manager**: `pnpm` (recommended) or `npm` / `yarn`
- **MongoDB**: A running MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Google Books API Key** *(Optional)*: A free API key from Google Cloud Console for enhanced rate limits when searching books.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nook.git
   cd nook
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your environment variables:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nook?retryWrites=true&w=majority
   JWT_SECRET=your-production-jwt-secret-key
   GOOGLE_BOOKS_API_KEY=your-google-books-api-key-optional
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | **Yes** | MongoDB connection string URI |
| `JWT_SECRET` | **Yes** | Secret key used for signing authentication JWT tokens |
| `GOOGLE_BOOKS_API_KEY` | Optional | Google Books API Key to increase search quota limits (`process.env.GOOGLE_BOOKS_API_KEY` or `process.env.googleBooksApi`) |

---

## Project Structure

```
nook/
├── public/                  # Static assets (nook-logo.svg, covers, etc.)
├── src/
│   ├── app/                 # Next.js App Router pages & API routes
│   │   ├── (auth)/          # Authentication routes (sign-in, sign-up)
│   │   ├── (dashboard)/     # Main application screens (home, library)
│   │   ├── api/             # RESTful API route handlers
│   │   ├── layout.tsx       # Root layout with fonts & providers
│   │   └── page.tsx         # Landing page with 3D bookshelf
│   ├── components/          # Reusable React components
│   │   ├── auth/            # Auth forms & hero marquee
│   │   ├── books/           # Book cards & Google Books search drawers
│   │   ├── home/            # Reading sidebar & stats widgets
│   │   ├── library/         # Library tabs, list grid & detail views
│   │   ├── lists/           # Unified collection management drawers
│   │   ├── navigation/      # Mobile navigation bar
│   │   ├── sidebar/         # Responsive 3-tier AppSidebar
│   │   └── ui/              # Primitive design system components
│   ├── hooks/               # Custom React hooks (use-mobile, etc.)
│   ├── lib/                 # Utility functions, DB connection, auth & Zod schemas
│   ├── models/              # Mongoose database models (User, Book, List)
│   ├── proxy.ts             # Route protection middleware exporter
│   └── types/               # TypeScript type definitions
├── package.json
└── tsconfig.json
```

---

## Scripts

- `pnpm dev` – Starts the local development server with Turbopack.
- `pnpm build` – Generates an optimized production build.
- `pnpm start` – Starts the Next.js production server.
- `pnpm tsc --noEmit` – Runs TypeScript type checks.

---

## License

This project is licensed under the MIT License.
