import { NextRequest, NextResponse } from "next/server";
import { GoogleBookSearchResult } from "@/types/books";

interface GoogleVolumeInfo {
  title?: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    small?: string;
    thumbnail?: string;
    smallThumbnail?: string;
  };
  categories?: string[];
  pageCount?: number;
  publishedDate?: string;
}

interface GoogleVolumeItem {
  id: string;
  volumeInfo?: GoogleVolumeInfo;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ items: [] });
  }

  const apiKey = process.env.googleBooksApi || process.env.GOOGLE_BOOKS_API_KEY || "";
  const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : "";

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query.trim())}&langRestrict=en&orderBy=relevance&maxResults=10${keyParam}`
    );

    if (!res.ok) {
      return NextResponse.json({ items: [] }, { status: res.status });
    }

    const data = await res.json();
    const items: GoogleBookSearchResult[] = (data.items || []).map((item: GoogleVolumeItem) => {
      const info = item.volumeInfo || {};
      const imageLinks = info.imageLinks || {};

      const getSecureUrl = (url?: string) => {
        if (!url) return "";
        return url.startsWith("http://") ? url.replace("http://", "https://") : url;
      };

      const rawCoverUrl =
        imageLinks.medium ||
        imageLinks.large ||
        imageLinks.extraLarge ||
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        "";

      const rawSmallCoverUrl =
        imageLinks.small ||
        imageLinks.smallThumbnail ||
        imageLinks.thumbnail ||
        rawCoverUrl;

      console.log(rawCoverUrl)
      console.log(rawSmallCoverUrl)
      
      const rawCategories = info.categories || [];
      const parsedCategoriesSet = new Set<string>();

      rawCategories.forEach((cat) => {
        cat.split(/[\/\,]/).forEach((part) => {
          const trimmed = part.trim();
          if (trimmed) {
            parsedCategoriesSet.add(trimmed);
          }
        });
      });

      return {
        id: item.id,
        googleBookId: item.id,
        title: info.title || "",
        authors: info.authors || [],
        description: info.description || "",
        coverUrl: getSecureUrl(rawCoverUrl),
        smallCoverUrl: getSecureUrl(rawSmallCoverUrl),
        categories: Array.from(parsedCategoriesSet),
        pageCount: info.pageCount || undefined,
        publishedDate: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4), 10) : undefined,
      };
    });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
