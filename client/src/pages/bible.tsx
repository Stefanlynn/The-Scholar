import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const books = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState("Matthew");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["/api/bible", selectedBook, selectedChapter],
    enabled: !!selectedBook && !!selectedChapter,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/api/bible/search", searchQuery],
    enabled: !!searchQuery && searchQuery.length > 2,
  });

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    setSelectedChapter(selectedChapter + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Bible</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Scripture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search Results */}
          {searchQuery && (
            <Card className="bg-[var(--scholar-dark)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Search Results for "{searchQuery}"</CardTitle>
              </CardHeader>
              <CardContent>
                {isSearching ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  </div>
                ) : searchResults?.results?.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.results.map((result: any, index: number) => (
                      <div key={index} className="p-3 bg-[var(--scholar-darker)] rounded-lg">
                        <div className="text-[var(--scholar-gold)] font-medium mb-1">
                          {result.book} {result.chapter}:{result.verse}
                        </div>
                        <div className="text-gray-200 bible-text">{result.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No results found</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bible Reader */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger className="w-48 bg-[var(--scholar-darker)] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                      {books.map((book) => (
                        <SelectItem key={book} value={book} className="text-white hover:bg-gray-700">
                          {book}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(Number(value))}>
                    <SelectTrigger className="w-24 bg-[var(--scholar-darker)] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                      {Array.from({ length: 50 }, (_, i) => i + 1).map((chapter) => (
                        <SelectItem key={chapter} value={chapter.toString()} className="text-white hover:bg-gray-700">
                          {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousChapter}
                    disabled={selectedChapter <= 1}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextChapter}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[var(--scholar-gold)]">
                  {selectedBook} {selectedChapter}
                </h3>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full bg-gray-700" />
                    ))}
                  </div>
                ) : chapterData?.verses ? (
                  <div className="space-y-3">
                    {chapterData.verses.map((verse: any) => (
                      <div key={verse.verse} className="flex space-x-4">
                        <span className="text-[var(--scholar-gold)] font-bold min-w-[2rem]">
                          {verse.verse}
                        </span>
                        <span className="text-gray-200 bible-text flex-1">
                          {verse.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 bible-text">
                    Chapter content will appear here when connected to a Bible API.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
