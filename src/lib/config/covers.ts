export interface BookCoverConfig {
  id: string;
  title: string;
  author: string;
  url: string;
}

export const SAMPLE_BOOK_COVERS: BookCoverConfig[] = [
  {
    id: "cover-1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-2",
    title: "1984",
    author: "George Orwell",
    url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-4",
    title: "Brave New World",
    author: "Aldous Huxley",
    url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-5",
    title: "Dune",
    author: "Frank Herbert",
    url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-7",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    url: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-8",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-9",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-10",
    title: "The Alchemist",
    author: "Paulo Coelho",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-11",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-12",
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    url: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-13",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-14",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    url: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cover-15",
    title: "The Odyssey",
    author: "Homer",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
  },
];

export function getCoverByIndex(index: number): BookCoverConfig {
  const normalizedIndex = Math.abs(index) % SAMPLE_BOOK_COVERS.length;
  return SAMPLE_BOOK_COVERS[normalizedIndex];
}

export function getRandomCover(): BookCoverConfig {
  const randomIndex = Math.floor(Math.random() * SAMPLE_BOOK_COVERS.length);
  return SAMPLE_BOOK_COVERS[randomIndex];
}

export function getRandomCovers(count: number): BookCoverConfig[] {
  const shuffled = [...SAMPLE_BOOK_COVERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
