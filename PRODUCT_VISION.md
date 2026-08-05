# Nook — Product Vision

> *Your personal reading corner on the internet.*

---

## The Name

**Nook** — a small, cozy corner. The word itself is warm, intimate, and instantly evokes the act of reading. It's also short, memorable, and works beautifully as a domain, wordmark, and product personality. A nook isn't a library — it's *your* corner.

---

## The Problem We're Solving

Most reading trackers fail in one of two ways:

1. **Too simple** — A spreadsheet with a UI slapped on top. No joy, no texture, no soul.
2. **Too complex** — Goodreads-style social networks that bury personal reading behind reviews, ratings, friends, and recommendations.

There's no middle ground: a focused, personal, *beautiful* tool just for tracking your own reading life.

Nook fills that gap.

---

## Who Nook Is For

**The intentional reader.** Someone who:

- Reads at least a handful of books a year
- Loses track of books they want to read
- Wishes they could remember what they thought of a book months later
- Wants to feel good about their reading habit — not overwhelmed by it

Nook is not social. It doesn't care how many books other people have read. It only cares about *yours*.

---

## Design Philosophy

### Warm, not clinical
Nook uses the palette of cozy things: warm cream backgrounds, amber highlights, soft coral accents. It feels like a well-lit reading nook on a Sunday afternoon — not a productivity dashboard.

### Quiet, not noisy
Data surfaces gently. There are no notifications, no streaks demanding attention, no guilt-inducing metrics. The interface gets out of the way and lets the books be the center of attention.

### Alive, not static
Subtle micro-interactions acknowledge your actions. Marking a book as completed *feels* like finishing a book — satisfying, celebratory, complete. The UI has physical weight and spring to it.

### Yours, not generic
Your library looks different from everyone else's — because Nook adapts each book card's color palette to its cover art. A library of books becomes a personal, visual mosaic.

---

## Visual Direction

**Color Palette**

| Role | Name | Value |
|------|------|-------|
| Background | Warm Paper | `#FFFBF3` |
| Surface | Cream | `#FFF8EC` |
| Primary | Amber | `#F59E0B` |
| Secondary | Coral | `#FB7185` |
| Success | Sage | `#34D399` |
| Text | Ink | `#1C1917` |
| Muted | Stone | `#78716C` |

**Typography**
- Headings: `Cal Sans` or `Fraunces` — warm, slightly literary serif energy
- Body: `Inter` or `Geist` — clean and legible

**Status Colors**
- 📖 Want to Read → Sky blue (`#38BDF8`)
- 📘 Reading → Amber (`#F59E0B`)
- ✅ Completed → Sage green (`#34D399`)

**Inspiration**
- *Fable* — rich cover art, visual book discovery
- *Duolingo* — cheerful micro-interactions, celebratory moments
- *Headspace* — generous whitespace, calm and approachable
- *Spotify* — dominant color extraction from artwork

---

## Core User Journey

```
Land on Nook
     ↓
See inviting landing page with preview of what the library looks like
     ↓
Sign up (name, email, password — that's it)
     ↓
Warm onboarding: "What's a book you're reading right now?"
     ↓
Search Google Books → select → auto-fill metadata → set status → save
     ↓
Dashboard: immediately oriented, library feels alive, not empty
     ↓
Add more books, organize into lists, track progress
```

---

## Feature Set

### 1. Authentication
- Sign up, log in, log out
- JWT stored in httpOnly cookie
- Protected routes via Next.js middleware
- No OAuth complexity — email/password only, done right

### 2. Dashboard
The first thing you see after logging in. Designed to *orient* not *overwhelm*.

- **Currently Reading** — Hero card showing your active book(s) with cover art, reading progress bar (if page tracking enabled), and a "Continue" CTA
- **Quick Stats** — Total books, completed this year, currently reading count
- **Quick Actions** — Add Book, Create List (two buttons, nothing more)
- **Recent Activity** — Last 3–4 books touched (added, status changed, etc.)

### 3. Library
Your full personal collection.

- **Grid View** (default) — Rich book cards with cover art, dominant-color accent, status badge, and author
- **Bookshelf View** — Books rendered as vertical spines on a shelf, heights varying by page count, colors from cover art. A visual delight that no other simple tracker has.
- **Search** — Fuzzy search by title or author within your library
- **Filters** — By status, by tag/category, by list — combinable
- **Status Change** — Click a book, change status inline. Marking "Completed" triggers a celebration moment.
- **Edit / Delete** — From the book detail drawer

### 4. Book Detail Drawer
Right-slide panel (not a new page) with:
- Full cover art
- Title, authors, description
- Status selector
- Reading progress (current page / total pages) — shown as a gradient progress bar
- Tags/categories
- Lists the book belongs to
- Personal note — a single text field for a quote or thought. Not reviews, not ratings. Just a note.
- "Completed on" date (auto-set when status changes to Completed)

### 5. Add Book Flow
The primary interaction, refined to be as frictionless as possible.

```
Click "Add Book"
     ↓
Search Google Books (debounced, real-time)
     ↓
Select result (cover art thumbnail shown inline)
     ↓
Sheet slides up: metadata pre-filled (title, authors, cover, description, page count)
     ↓
User sets: Status, Tags, Lists, optional Note
     ↓
Save → card animates into library
     ↓
     ← OR → "Can't find your book?" → manual entry form
```

### 6. Lists
User-created collections (playlists for books).

- Create, rename, delete lists
- Assign custom emoji icon and color
- Books can belong to multiple lists
- Each list has its own view (filtered library)
- Examples: "Favorites", "Summer 2025", "Books To Buy", "Recommended by Dad"

### 7. Dominant Color Theming
Each book card's accent color is extracted from its cover image using `color-thief-ts` (client-side, no server needed). The result:
- Every book card has a unique, harmonious color accent from its own cover
- The library becomes a colorful personal mosaic
- No two libraries look the same

### 8. Completion Celebration
When a book's status changes to "Completed":
- A burst of confetti plays (using `canvas-confetti`)
- The card animates into the Completed section with a satisfying spring motion
- The stat counter increments with a count-up animation
- This moment is the emotional payoff of using Nook

### 9. Reading Progress
For books with status "Reading":
- Users can set current page (e.g., "Page 127 of 432")
- A soft gradient progress bar appears on the card and in the drawer
- Adds a tactile, motivating element without requiring heavy habit-tracking

### 10. CMD+K Command Palette
A keyboard shortcut (`⌘K` / `Ctrl+K`) that opens a search palette:
- Jump to Dashboard / Library / a specific List
- Add a new book
- Search your library
- Change a book's status
This is a power-user feature that signals engineering thoughtfulness and separates Nook from generic CRUD apps.

### 11. Smart Onboarding
First-time users see a gentle, 2-step onboarding:
1. "Welcome to Nook, [Name]! What are you reading right now?" → opens Add Book flow
2. "Great! Want to add something you've finished?" → optional second add

After onboarding (or skipping), they land on a populated dashboard instead of a blank slate.

---

## What Nook Intentionally Does Not Have

- Social features (following, friends, public feeds)
- Star ratings or written reviews
- Complex analytics or reading statistics dashboards
- Notifications or email reminders
- Browser extensions
- Import from Goodreads (could be a future feature)

These omissions are deliberate. Nook stays focused.

---

## What Makes Nook Memorable to a Reviewer

| Feature | Why It Stands Out |
|---------|------------------|
| Bookshelf View | No simple tracker has this. Visually stunning, instantly memorable. |
| Dominant Color Theming | Each library looks unique. Shows deep frontend thinking. |
| Completion Celebration | Emotional design. Shows understanding of delight and reward loops. |
| CMD+K Palette | Power user thinking. Shows production-app sensibility. |
| Google Books Integration | Reduces friction dramatically. Shows product instinct. |
| Book Detail Drawer | Right pattern for the job — no navigation, no context loss. |
| Reading Progress | Tactile, motivating. Shows empathy for the reading experience. |
| Personal Notes | One field. Not reviews. Shows restraint and editorial judgment. |
| Warm Onboarding | Nobody submits assignments with good onboarding. |
| Named "Nook" | The name itself communicates product thinking. |

---

## The Feeling We're After

A reviewer opens Nook. They log in. They see a library of books — their books — each card with a color pulled from its own cover, arranged in a warm cream grid. They click a book they just finished. They change the status to Completed. Confetti. A small counter ticks up. They smile.

That's the goal. Make the reviewer smile.
