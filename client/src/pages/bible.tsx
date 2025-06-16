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
  X,
  Languages,
  BookOpen,
  Clock,
  Target,
  FileText,
  PenTool,
  Grid3X3,
  Heart,
  Plus,
  Copy,
  Share
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
  const [scholarResponse, setScholarResponse] = useState<string>("");
  const [showScholarDialog, setShowScholarDialog] = useState(false);
  const [scholarLoading, setScholarLoading] = useState(false);
  const [currentVerseForStudy, setCurrentVerseForStudy] = useState<any>(null);
  
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
      setScholarLoading(true);
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setScholarLoading(false);
      setScholarResponse(data.response || "The Scholar's response is ready.");
      setShowScholarDialog(true);
    },
    onError: (error) => {
      setScholarLoading(false);
      toast({ 
        title: "Connection Error", 
        description: "Unable to connect to The Scholar. Please try again.",
        variant: "destructive" 
      });
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

  // Study tool handlers connecting to our APIs
  const handleStudyTool = async (toolType: string) => {
    if (!selectedVerse) return;
    
    const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
    const verseText = selectedVerse.text;
    
    // Store current verse for display in dialog
    setCurrentVerseForStudy({
      reference: verseRef,
      text: verseText
    });
    
    // Show loading immediately
    setScholarLoading(true);
    setShowScholarDialog(true);
    setScholarResponse("");
    
    let query = "";
    
    switch (toolType) {
      case 'greek-hebrew':
        query = `Provide a detailed Greek/Hebrew word study analysis for "${verseText}" (${verseRef}). Include Strong's numbers, original words, pronunciation, transliteration, definitions, and where else these words appear in Scripture.`;
        break;
        
      case 'cross-references':
        query = `Find cross-references for "${verseText}" (${verseRef}). Show related verses by theme, key words, and fulfillment connections between Old and New Testament.`;
        break;
        
      case 'commentary':
        query = `Provide theological and practical commentary insights for "${verseText}" (${verseRef}). Give me your Scholar's Take combining Protestant theological perspectives with practical application.`;
        break;
        
      case 'cultural-context':
        query = `Explain the cultural and historical context for "${verseText}" (${verseRef}). Include time period, author background, audience, purpose, and ancient vs biblical worldview differences.`;
        break;
        
      case 'topical-tags':
        query = `Identify major theological themes and topics in "${verseText}" (${verseRef}). Provide topical tags and suggest other verses that share these themes.`;
        break;
        
      case 'sermon-tools':
        query = `Create sermon preparation tools for "${verseText}" (${verseRef}). Provide outline points, illustrations, practical applications, and modern headlines that reflect this truth.`;
        break;
        
      case 'structural-patterns':
        query = `Analyze the literary structure and patterns in "${verseText}" (${verseRef}). Identify chiasms, repetition, poetic elements, and show where this passage fits in broader biblical structure.`;
        break;
        
      case 'devotional':
        query = `Create a personal devotional based on "${verseText}" (${verseRef}). Structure it with: verse, reflection, practical application, and closing prayer.`;
        break;
    }
    
    if (query) {
      scholarMutation.mutate(query);
      setSelectedVerse(null);
    }
  };

  // Quick action handlers
  const handleQuickAction = async (action: string) => {
    if (!selectedVerse) return;
    
    const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
    
    switch (action) {
      case 'bookmark':
        handleBookmark(verseRef);
        break;
        
      case 'add-to-sermon':
        // Add to sermon preparation
        try {
          await fetch('/api/sermons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `Sermon on ${verseRef}`,
              outline: `Key verse: "${selectedVerse.text}" (${verseRef})`,
              scripture: verseRef
            })
          });
          toast({ title: "Added to sermon prep", description: "Verse added to your sermon preparation" });
        } catch (error) {
          toast({ title: "Error", description: "Failed to add to sermon", variant: "destructive" });
        }
        break;
        
      case 'copy':
        try {
          await navigator.clipboard.writeText(`"${selectedVerse.text}" - ${verseRef}`);
          toast({ title: "Copied to clipboard", description: "Verse copied with reference" });
        } catch (error) {
          toast({ title: "Copy failed", description: "Could not copy to clipboard", variant: "destructive" });
        }
        break;
        
      case 'share':
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Bible Verse - ${verseRef}`,
              text: `"${selectedVerse.text}" - ${verseRef}`,
            });
          } catch (error) {
            // Fallback to clipboard
            await navigator.clipboard.writeText(`"${selectedVerse.text}" - ${verseRef}`);
            toast({ title: "Copied for sharing", description: "Verse copied to clipboard" });
          }
        } else {
          await navigator.clipboard.writeText(`"${selectedVerse.text}" - ${verseRef}`);
          toast({ title: "Copied for sharing", description: "Verse copied to clipboard" });
        }
        break;
    }
  };

  const handleScholarQuestion = () => {
    if (selectedVerse && scholarQuery.trim()) {
      const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
      const fullQuery = `Regarding "${selectedVerse.text}" (${verseRef}): ${scholarQuery}`;
      scholarMutation.mutate(fullQuery);
      setScholarQuery("");
      setSelectedVerse(null);
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
                  <ChevronLeft 
                    className={`h-6 w-6 cursor-pointer ${
                      selectedChapter <= 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-[var(--scholar-gold)] hover:text-yellow-300'
                    }`}
                    onClick={selectedChapter > 1 ? handlePreviousChapter : undefined}
                  />
                  <ChevronRight 
                    className="h-6 w-6 text-[var(--scholar-gold)] hover:text-yellow-300 cursor-pointer"
                    onClick={handleNextChapter}
                  />
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
                    <ChevronLeft 
                      className={`h-6 w-6 cursor-pointer ${
                        selectedChapter <= 1 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-[var(--scholar-gold)] hover:text-yellow-300'
                      }`}
                      onClick={selectedChapter > 1 ? handlePreviousChapter : undefined}
                    />
                    <ChevronRight 
                      className="h-6 w-6 text-[var(--scholar-gold)] hover:text-yellow-300 cursor-pointer"
                      onClick={handleNextChapter}
                    />
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
                                  isHighlighted ? handleRemoveHighlight(verseKey) : handleHighlight(verseKey);
                                }}
                                className={`p-1.5 rounded-lg ${
                                  isHighlighted 
                                    ? 'bg-yellow-500/20 text-yellow-400' 
                                    : 'bg-gray-700/30 text-gray-500 hover:text-gray-300'
                                }`}
                                title="Highlight verse"
                              >
                                <Highlighter className="h-3.5 w-3.5" />
                              </Button>
                              
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

        {/* Scholar Study Tools Dialog */}
        <Dialog open={!!selectedVerse} onOpenChange={() => setSelectedVerse(null)}>
          <DialogContent className="bg-[var(--scholar-darker)] border-[var(--scholar-gold)]/20 text-white max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader className="border-b border-[var(--scholar-gold)]/20 pb-4">
              <DialogTitle className="text-[var(--scholar-gold)] flex items-center text-xl">
                <GraduationCap className="h-6 w-6 mr-3" />
                The Scholar Study Tools
                {selectedVerse && (
                  <span className="text-gray-300 text-base ml-2 font-normal">
                    {selectedBook} {selectedChapter}:{selectedVerse.verse}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedVerse && (
              <div className="space-y-6 pt-4">
                {/* Selected Verse Display */}
                <div className="relative p-6 bg-gradient-to-r from-[var(--scholar-gold)]/5 to-transparent rounded-xl border border-[var(--scholar-gold)]/20">
                  <div className="absolute top-4 right-4 text-[var(--scholar-gold)]/30">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <blockquote className="text-gray-100 bible-text leading-relaxed text-lg italic">
                    "{selectedVerse.text}"
                  </blockquote>
                  <cite className="text-[var(--scholar-gold)] text-sm mt-3 block not-italic font-medium">
                    — {selectedBook} {selectedChapter}:{selectedVerse.verse}
                  </cite>
                </div>

                {/* Study Tools Grid */}
                <div>
                  <h3 className="text-[var(--scholar-gold)] font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Choose Your Study Focus
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* 1. Greek/Hebrew Breakdown */}
                    <div
                      className="group p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10"
                      onClick={() => handleStudyTool('greek-hebrew')}
                    >
                      <Languages className="h-7 w-7 text-amber-400 mb-3 group-hover:text-amber-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Greek/Hebrew</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Original words, Strong's numbers, meanings</p>
                    </div>

                    {/* 2. Cross-References */}
                    <div
                      className="group p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 hover:border-blue-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                      onClick={() => handleStudyTool('cross-references')}
                    >
                      <BookOpen className="h-7 w-7 text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Cross-References</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Related verses by theme and keywords</p>
                    </div>

                    {/* 3. Commentary Insights */}
                    <div
                      className="group p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20 hover:border-purple-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                      onClick={() => handleStudyTool('commentary')}
                    >
                      <MessageCircle className="h-7 w-7 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Scholar's Take</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Theological & practical insights</p>
                    </div>

                    {/* 4. Cultural Context */}
                    <div
                      className="group p-5 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20 hover:border-green-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10"
                      onClick={() => handleStudyTool('cultural-context')}
                    >
                      <Clock className="h-7 w-7 text-green-400 mb-3 group-hover:text-green-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Cultural Context</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Historical background & setting</p>
                    </div>

                    {/* 5. Topical Tags */}
                    <div
                      className="group p-5 bg-gradient-to-br from-pink-500/10 to-pink-600/5 rounded-xl border border-pink-500/20 hover:border-pink-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/10"
                      onClick={() => handleStudyTool('topical-tags')}
                    >
                      <Target className="h-7 w-7 text-pink-400 mb-3 group-hover:text-pink-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Topical Tags</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Identify & explore major themes</p>
                    </div>

                    {/* 6. Sermon Tools */}
                    <div
                      className="group p-5 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 rounded-xl border border-indigo-500/20 hover:border-indigo-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10"
                      onClick={() => handleStudyTool('sermon-tools')}
                    >
                      <FileText className="h-7 w-7 text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Sermon Tools</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Outlines, illustrations, applications</p>
                    </div>

                    {/* 7. Structural Patterns */}
                    <div
                      className="group p-5 bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-xl border border-teal-500/20 hover:border-teal-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/10"
                      onClick={() => handleStudyTool('structural-patterns')}
                    >
                      <Grid3X3 className="h-7 w-7 text-teal-400 mb-3 group-hover:text-teal-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Literary Structure</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Patterns, devices, biblical structure</p>
                    </div>

                    {/* 8. Devotional Builder */}
                    <div
                      className="group p-5 bg-gradient-to-br from-rose-500/10 to-rose-600/5 rounded-xl border border-rose-500/20 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-rose-500/10"
                      onClick={() => handleStudyTool('devotional')}
                    >
                      <Heart className="h-7 w-7 text-rose-400 mb-3 group-hover:text-rose-300 transition-colors" />
                      <h4 className="font-semibold text-gray-100 mb-1">Devotional Builder</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">Create personal devotions</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-[var(--scholar-gold)]/20 pt-6">
                  <h4 className="text-[var(--scholar-gold)] font-semibold mb-4 flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleQuickAction('bookmark')}
                      className="flex items-center px-4 py-2 bg-[var(--scholar-gold)]/10 border border-[var(--scholar-gold)]/30 rounded-lg text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/20 transition-colors"
                    >
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Bookmark
                    </button>
                    <button
                      onClick={() => handleQuickAction('add-to-sermon')}
                      className="flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Sermon
                    </button>
                    <button
                      onClick={() => handleQuickAction('copy')}
                      className="flex items-center px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Verse
                    </button>
                    <button
                      onClick={() => handleQuickAction('share')}
                      className="flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Note & Scholar Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--scholar-gold)]/20 pt-6">
                  {/* Add Note Section */}
                  <div className="space-y-4">
                    <h4 className="text-[var(--scholar-gold)] font-semibold flex items-center">
                      <StickyNote className="h-5 w-5 mr-2" />
                      Quick Note
                    </h4>
                    <Textarea
                      placeholder="Write your personal thoughts about this verse..."
                      value={verseNote}
                      onChange={(e) => setVerseNote(e.target.value)}
                      className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/20 text-gray-100 focus:border-[var(--scholar-gold)]/40 resize-none"
                      rows={4}
                    />
                    <Button 
                      onClick={handleAddNote}
                      disabled={!verseNote.trim() || noteMutation.isPending}
                      className="w-full bg-[var(--scholar-gold)] text-black hover:bg-[var(--scholar-gold)]/90 font-medium"
                    >
                      {noteMutation.isPending ? 'Saving...' : 'Save Note'}
                    </Button>
                  </div>

                  {/* Ask The Scholar */}
                  <div className="space-y-4">
                    <h4 className="text-[var(--scholar-gold)] font-semibold flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Ask The Scholar
                    </h4>
                    <Textarea
                      placeholder="What would you like to know about this verse?"
                      value={scholarQuery}
                      onChange={(e) => setScholarQuery(e.target.value)}
                      className="bg-[var(--scholar-dark)] border-blue-500/20 text-gray-100 focus:border-blue-500/40 resize-none"
                      rows={4}
                    />
                    <Button 
                      onClick={handleScholarQuestion}
                      disabled={!scholarQuery.trim() || scholarMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
                    >
                      {scholarMutation.isPending ? 'Asking...' : 'Ask The Scholar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Scholar Response Dialog */}
        <Dialog open={showScholarDialog} onOpenChange={setShowScholarDialog}>
          <DialogContent className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[var(--scholar-gold)] text-xl font-semibold flex items-center">
                <GraduationCap className="h-6 w-6 mr-2" />
                The Scholar's Analysis
              </DialogTitle>
            </DialogHeader>
            
            {/* Verse Reference Display */}
            {currentVerseForStudy && (
              <div className="bg-[var(--scholar-darker)] border border-[var(--scholar-gold)]/20 rounded-lg p-4 mb-6">
                <div className="text-[var(--scholar-gold)] font-semibold text-lg mb-2">
                  {currentVerseForStudy.reference}
                </div>
                <div className="text-gray-200 leading-relaxed italic text-base">
                  "{currentVerseForStudy.text}"
                </div>
              </div>
            )}
            
            <div className="mt-4">
              {scholarLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[var(--scholar-gold)]">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--scholar-gold)]"></div>
                    <span>Analyzing Scripture and connecting to biblical resources...</span>
                  </div>
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                  <Skeleton className="h-4 w-4/5 bg-gray-700" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-100 leading-relaxed whitespace-pre-wrap text-base">
                    {scholarResponse}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={() => setShowScholarDialog(false)}
                className="bg-[var(--scholar-gold)] text-black hover:bg-[var(--scholar-gold)]/90"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <MobileTabBar />
      </div>
    </TooltipProvider>
  );
}
