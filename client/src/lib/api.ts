export const API_BASE_URL = "";

export interface BibleSearchResult {
  query: string;
  results: Array<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: Array<{
    verse: number;
    text: string;
  }>;
}

export interface StrongsResult {
  strongsNumber: string;
  originalWord: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  kjvTranslations: string[];
  occurrences: Array<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
}

export async function searchBible(query: string): Promise<BibleSearchResult> {
  const response = await fetch(`${API_BASE_URL}/api/bible/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search Bible");
  }
  return response.json();
}

export async function getBibleChapter(book: string, chapter: number): Promise<BibleChapter> {
  const response = await fetch(`${API_BASE_URL}/api/bible/${encodeURIComponent(book)}/${chapter}`);
  if (!response.ok) {
    throw new Error("Failed to get Bible chapter");
  }
  return response.json();
}

export async function searchStrongs(strongsNumber: string): Promise<StrongsResult> {
  const response = await fetch(`${API_BASE_URL}/api/strongs/${encodeURIComponent(strongsNumber)}`);
  if (!response.ok) {
    throw new Error("Failed to search Strong's concordance");
  }
  return response.json();
}
