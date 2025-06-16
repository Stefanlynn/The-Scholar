import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getBibleChapter } from "@/lib/api";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Highlighter, 
  BookmarkPlus, 
  MessageCircle, 
  GraduationCap,
  Palette,
  StickyNote,
  X
} from "lucide-react";

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

const translations = [
  { value: "kjv", label: "King James Version" },
  { value: "niv", label: "New International Version" },
  { value: "esv", label: "English Standard Version" },
  { value: "nlt", label: "New Living Translation" },
  { value: "nasb", label: "New American Standard Bible" },
  { value: "nkjv", label: "New King James Version" }
];

const highlightColors = [
  { value: "yellow", label: "Yellow", color: "bg-yellow-200 text-yellow-900" },
  { value: "green", label: "Green", color: "bg-green-200 text-green-900" },
  { value: "blue", label: "Blue", color: "bg-blue-200 text-blue-900" },
  { value: "pink", label: "Pink", color: "bg-pink-200 text-pink-900" },
  { value: "purple", label: "Purple", color: "bg-purple-200 text-purple-900" }
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState("Matthew");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [verseNote, setVerseNote] = useState("");
  const [scholarQuery, setScholarQuery] = useState("");
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [verseNotes, setVerseNotes] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["/api/bible", selectedBook, selectedChapter, selectedTranslation],
    queryFn: () => getBibleChapter(selectedBook, selectedChapter, selectedTranslation),
    enabled: !!selectedBook && !!selectedChapter,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["/api/bible/search", searchQuery],
    enabled: !!searchQuery && searchQuery.length > 2,
  });

  // Mutations for verse interactions
  const bookmarkMutation = useMutation({
    mutationFn: async (verseRef: string) => {
      const [book, chapter, verse] = verseRef.split(':');
      return fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          chapter: parseInt(chapter),
          verse: parseInt(verse)
        })
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({ title: "Bookmark added", description: "Verse saved to your bookmarks" });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    }
  });

  const noteMutation = useMutation({
    mutationFn: async ({ verseRef, note }: { verseRef: string; note: string }) => {
      return fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Note on ${verseRef}`,
          content: note,
          scripture: verseRef
        })
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({ title: "Note saved", description: "Your verse note has been saved" });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    }
  });

  const scholarMutation = useMutation({
    mutationFn: async (query: string) => {
      return fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      }).then(res => res.json());
    },
    onSuccess: (data) => {
      toast({ title: "Scholar response ready", description: "Check your chat for the answer" });
    }
  });

  // Handler functions for verse interactions
  const handleVerseClick = (verse: any) => {
    setSelectedVerse(verse);
  };

  const handleHighlight = (verseKey: string) => {
    setHighlights(prev => ({ ...prev, [verseKey]: highlightColor }));
    toast({ title: "Verse highlighted", description: `Applied ${highlightColor} highlight` });
  };

  const handleRemoveHighlight = (verseKey: string) => {
    setHighlights(prev => {
      const newHighlights = { ...prev };
      delete newHighlights[verseKey];
      return newHighlights;
    });
    toast({ title: "Highlight removed" });
  };

  const handleBookmark = (verseKey: string) => {
    if (bookmarks.has(verseKey)) {
      setBookmarks(prev => {
        const newBookmarks = new Set(prev);
        newBookmarks.delete(verseKey);
        return newBookmarks;
      });
      toast({ title: "Bookmark removed" });
    } else {
      setBookmarks(prev => new Set(prev).add(verseKey));
      bookmarkMutation.mutate(verseKey);
    }
  };

  const handleAddNote = () => {
    if (selectedVerse && verseNote.trim()) {
      const verseKey = `${selectedBook}:${selectedChapter}:${selectedVerse.verse}`;
      setVerseNotes(prev => ({ ...prev, [verseKey]: verseNote }));
      noteMutation.mutate({ verseRef: verseKey, note: verseNote });
      setVerseNote("");
      setSelectedVerse(null);
    }
  };

  const handleScholarQuestion = () => {
    if (selectedVerse && scholarQuery.trim()) {
      const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
      const fullQuery = `Regarding ${verseRef} - "${selectedVerse.text}": ${scholarQuery}`;
      scholarMutation.mutate(fullQuery);
      setScholarQuery("");
      setSelectedVerse(null);
    }
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const handleNextChapter = () => {
    setSelectedChapter(selectedChapter + 1);
  };

  const getVerseKey = (verse: any) => `${selectedBook}:${selectedChapter}:${verse.verse}`;
  const getHighlightClass = (verseKey: string) => {
    const color = highlights[verseKey];
    return color ? highlightColors.find(c => c.value === color)?.color || '' : '';
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-First Top Bar */}
          <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Bible Study</h2>
                <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                  <SelectTrigger className="w-20 bg-[var(--scholar-darker)] border-gray-600 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                    {translations.map((translation) => (
                      <SelectItem key={translation.value} value={translation.value} className="text-white hover:bg-gray-700">
                        {translation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Scripture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-full focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">Bible Study</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                  <SelectTrigger className="w-44 bg-[var(--scholar-darker)] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                    {translations.map((translation) => (
                      <SelectItem key={translation.value} value={translation.value} className="text-white hover:bg-gray-700">
                        {translation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-6 space-y-4 md:space-y-6">
            {/* Search Results */}
            {searchQuery && (
              <Card className="bg-[var(--scholar-dark)] border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base md:text-lg">Search Results for "{searchQuery}"</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {isSearching ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 bg-gray-700" />
                    </div>
                  ) : (searchResults as any)?.results?.length > 0 ? (
                    <div className="space-y-3">
                      {(searchResults as any).results.map((result: any, index: number) => (
                        <div key={index} className="p-3 bg-[var(--scholar-darker)] rounded-lg">
                          <div className="text-[var(--scholar-gold)] font-medium mb-1 text-sm">
                            {result.book} {result.chapter}:{result.verse}
                          </div>
                          <div className="text-gray-200 text-sm leading-relaxed">{result.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No results found</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mobile Bible Navigation */}
            <div className="md:hidden bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[var(--scholar-gold)] font-semibold text-lg">
                  {selectedBook} {selectedChapter}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousChapter}
                    disabled={selectedChapter <= 1}
                    className="border-gray-600 text-white hover:bg-gray-700 p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextChapter}
                    className="border-gray-600 text-white hover:bg-gray-700 p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
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
                  <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map((chapter) => (
                      <SelectItem key={chapter} value={chapter.toString()} className="text-white hover:bg-gray-700">
                        Chapter {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
                    <Palette className="h-4 w-4 mr-2" />
                    Highlight Color: {highlightColors.find(c => c.value === highlightColor)?.label}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[var(--scholar-darker)] border-gray-600">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 font-medium">Tap verse text to highlight:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {highlightColors.map((color) => (
                        <Button
                          key={color.value}
                          variant={highlightColor === color.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHighlightColor(color.value)}
                          className={`justify-start ${color.color}`}
                        >
                          {color.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Desktop Bible Reader */}
            <Card className="hidden md:block bg-[var(--scholar-dark)] border-gray-700">
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
                      className="border-gray-600 text-white hover:bg-gray-700 p-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextChapter}
                      className="border-gray-600 text-white hover:bg-gray-700 p-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[var(--scholar-gold)]">
                    {selectedBook} {selectedChapter} ({selectedTranslation.toUpperCase()})
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-full bg-gray-700" />
                      ))}
                    </div>
                  ) : (chapterData as any)?.verses ? (
                    <div className="space-y-4">
                      {(chapterData as any).verses.map((verse: any) => {
                        const verseKey = getVerseKey(verse);
                        const isHighlighted = highlights[verseKey];
                        const isBookmarked = bookmarks.has(verseKey);
                        const hasNote = verseNotes[verseKey];
                        
                        return (
                          <div 
                            key={verse.verse} 
                            className={`group flex items-start space-x-4 p-3 rounded-lg transition-all hover:bg-[var(--scholar-darker)] cursor-pointer ${
                              isHighlighted ? getHighlightClass(verseKey) : ''
                            }`}
                            onClick={() => handleVerseClick(verse)}
                          >
                            <span className="text-[var(--scholar-gold)] font-bold min-w-[2rem] mt-1">
                              {verse.verse}
                            </span>
                            <div className="flex-1">
                              <span className="text-gray-200 bible-text leading-relaxed">
                                {verse.text}
                              </span>
                              {hasNote && (
                                <div className="mt-2 p-2 bg-[var(--scholar-darker)] rounded text-sm text-gray-300">
                                  <StickyNote className="h-3 w-3 inline mr-1" />
                                  {hasNote}
                                </div>
                              )}
                            </div>
                            
                            {/* Verse Tools */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      isHighlighted ? handleRemoveHighlight(verseKey) : handleHighlight(verseKey);
                                    }}
                                    className={`h-8 w-8 p-0 hover:bg-gray-600 ${isHighlighted ? 'text-yellow-500' : 'text-gray-400'}`}
                                  >
                                    <Highlighter className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isHighlighted ? 'Remove highlight' : 'Highlight verse'}
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBookmark(verseKey);
                                    }}
                                    className={`h-8 w-8 p-0 hover:bg-gray-600 ${isBookmarked ? 'text-[var(--scholar-gold)]' : 'text-gray-400'}`}
                                  >
                                    <BookmarkPlus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVerseClick(verse);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                                  >
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Add note</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVerseClick(verse);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-gray-600 text-gray-400"
                                  >
                                    <GraduationCap className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Ask The Scholar</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 bible-text">
                      Chapter content will appear here when connected to a Bible API.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Verse Display */}
            <div className="md:hidden space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-4">
                      <Skeleton className="h-4 w-full bg-gray-700" />
                    </div>
                  ))}
                </div>
              ) : (chapterData as any)?.verses ? (
                (chapterData as any).verses.map((verse: any) => {
                  const verseKey = getVerseKey(verse);
                  const isHighlighted = highlights[verseKey];
                  const isBookmarked = bookmarks.has(verseKey);
                  const hasNote = verseNotes[verseKey];
                  
                  return (
                    <div 
                      key={verse.verse}
                      className={`bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-4 transition-all active:scale-[0.98] ${
                        isHighlighted ? getHighlightClass(verseKey) : ''
                      }`}
                      onClick={() => handleVerseClick(verse)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-[var(--scholar-gold)] font-bold text-lg min-w-[2rem] mt-1">
                          {verse.verse}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p 
                              className={`text-gray-200 leading-relaxed text-base flex-1 pr-3 rounded px-2 py-1 ${
                                isHighlighted ? getHighlightClass(verseKey) : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                isHighlighted ? handleRemoveHighlight(verseKey) : handleHighlight(verseKey);
                              }}
                            >
                              {verse.text}
                            </p>
                            
                            {/* Verse Action Icons */}
                            <div className="flex items-start space-x-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerseClick(verse);
                                }}
                                className={`p-1.5 rounded-lg ${
                                  hasNote 
                                    ? 'bg-[var(--scholar-gold)]/20 text-[var(--scholar-gold)]' 
                                    : 'bg-gray-700/30 text-gray-500 hover:text-gray-300'
                                }`}
                                title="Add note"
                              >
                                <StickyNote className="h-3.5 w-3.5" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerseClick(verse);
                                }}
                                className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                                title="Ask The Scholar"
                              >
                                <GraduationCap className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          {hasNote && (
                            <div className="mt-3 p-3 bg-[var(--scholar-darker)] rounded-lg">
                              <div className="flex items-start space-x-2">
                                <StickyNote className="h-4 w-4 text-[var(--scholar-gold)] mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300 text-sm">{hasNote}</p>
                              </div>
                            </div>
                          )}
                          
                          {isBookmarked && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-[var(--scholar-gold)] border-[var(--scholar-gold)]/30 bg-[var(--scholar-gold)]/10">
                                <BookmarkPlus className="h-3 w-3 mr-1" />
                                Bookmarked
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    Chapter content will appear here when connected to a Bible API.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verse Tools Dialog */}
        <Dialog open={!!selectedVerse} onOpenChange={() => setSelectedVerse(null)}>
          <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-[var(--scholar-gold)]">
                {selectedVerse && `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`}
              </DialogTitle>
            </DialogHeader>
            
            {selectedVerse && (
              <div className="space-y-6">
                <div className="p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <p className="text-gray-200 bible-text leading-relaxed">
                    {selectedVerse.text}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Add Note */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center">
                      <StickyNote className="h-4 w-4 mr-2" />
                      Add Note
                    </h4>
                    <Textarea
                      placeholder="Write your note about this verse..."
                      value={verseNote}
                      onChange={(e) => setVerseNote(e.target.value)}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddNote}
                      disabled={!verseNote.trim() || noteMutation.isPending}
                      className="w-full bg-[var(--scholar-gold)] text-black hover:bg-[var(--scholar-gold)]/90"
                    >
                      {noteMutation.isPending ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>

                  {/* Ask The Scholar */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Ask The Scholar
                    </h4>
                    <Textarea
                      placeholder="What would you like to know about this verse?"
                      value={scholarQuery}
                      onChange={(e) => setScholarQuery(e.target.value)}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                      rows={3}
                    />
                    <Button 
                      onClick={handleScholarQuestion}
                      disabled={!scholarQuery.trim() || scholarMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {scholarMutation.isPending ? 'Asking...' : 'Ask The Scholar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <MobileTabBar />
      </div>
    </TooltipProvider>
  );
}
