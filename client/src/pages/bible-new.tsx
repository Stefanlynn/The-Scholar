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

  // Study tool handlers connecting to our APIs
  const handleStudyTool = async (toolType: string) => {
    if (!selectedVerse) return;
    
    const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
    const verseText = selectedVerse.text;
    
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

  const getHighlightClass = (verseKey: string) => {
    const color = highlights[verseKey];
    switch (color) {
      case 'yellow': return 'bg-yellow-200/30 text-yellow-100 border-yellow-400/50';
      case 'green': return 'bg-green-200/30 text-green-100 border-green-400/50';
      case 'blue': return 'bg-blue-200/30 text-blue-100 border-blue-400/50';
      case 'pink': return 'bg-pink-200/30 text-pink-100 border-pink-400/50';
      case 'purple': return 'bg-purple-200/30 text-purple-100 border-purple-400/50';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-[var(--scholar-darker)]">
        <Sidebar />
        
        <div className="flex-1 md:ml-64">
          <div className="p-6">
            {/* Mobile Bible Reader */}
            <div className="md:hidden space-y-6">
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
                  <SelectTrigger className="bg-[var(--scholar-dark)] border-gray-600 text-white">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-dark)] border-gray-600">
                    {books.map((book) => (
                      <SelectItem key={book} value={book} className="text-white hover:bg-gray-700">
                        {book}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(parseInt(value))}>
                  <SelectTrigger className="bg-[var(--scholar-dark)] border-gray-600 text-white">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-dark)] border-gray-600">
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
                  <CardTitle className="text-[var(--scholar-gold)]">
                    {selectedBook} {selectedChapter}
                  </CardTitle>

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedBook} onValueChange={setSelectedBook}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue placeholder="Select book" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--scholar-dark)] border-gray-600">
                        {books.map((book) => (
                          <SelectItem key={book} value={book} className="text-white hover:bg-gray-700">
                            {book}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(parseInt(value))}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue placeholder="Chapter" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--scholar-dark)] border-gray-600">
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((chapter) => (
                          <SelectItem key={chapter} value={chapter.toString()} className="text-white hover:bg-gray-700">
                            Chapter {chapter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue placeholder="Translation" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--scholar-dark)] border-gray-600">
                        {translations.map((translation) => (
                          <SelectItem key={translation.value} value={translation.value} className="text-white hover:bg-gray-700">
                            {translation.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Content - Traditional Bible Format */}
            <div className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-gray-700" />
                  ))}
                </div>
              ) : chapterData && chapterData.verses && chapterData.verses.length > 0 ? (
                <div className="bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-8">
                  <h2 className="text-[var(--scholar-gold)] text-2xl font-bold mb-6 text-center">
                    {selectedBook} Chapter {selectedChapter}
                  </h2>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-200 leading-relaxed text-lg">
                      {chapterData.verses.map((verse: any, index: number) => {
                        const verseKey = `${selectedBook}:${selectedChapter}:${verse.verse}`;
                        const isHighlighted = highlights[verseKey];
                        const hasNote = verseNotes[verseKey];
                        const isBookmarked = bookmarks.has(verseKey);
                        
                        return (
                          <span key={verse.verse}>
                            <span 
                              className={`group relative hover:bg-gray-800/50 rounded px-1 py-0.5 transition-all duration-200 cursor-pointer ${
                                isHighlighted ? getHighlightClass(verseKey) : ''
                              }`}
                              onClick={() => handleVerseClick(verse)}
                            >
                              <sup className="text-[var(--scholar-gold)] font-bold text-sm mr-1 select-none">
                                {verse.verse}
                              </sup>
                              <span className="select-text">
                                {verse.text}
                              </span>
                              
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-0 z-10 flex items-center space-x-1 bg-[var(--scholar-darker)] border border-gray-600 rounded-lg p-1 shadow-lg transition-opacity duration-200">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        isHighlighted ? handleRemoveHighlight(verseKey) : handleHighlight(verseKey);
                                      }}
                                      className={`p-1 h-6 w-6 ${
                                        isHighlighted 
                                          ? 'bg-yellow-500/20 text-yellow-400' 
                                          : 'text-gray-400 hover:text-yellow-300'
                                      }`}
                                    >
                                      <Highlighter className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{isHighlighted ? 'Remove highlight' : 'Highlight verse'}</p>
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
                                      className={`p-1 h-6 w-6 ${
                                        hasNote 
                                          ? 'bg-[var(--scholar-gold)]/20 text-[var(--scholar-gold)]' 
                                          : 'text-gray-400 hover:text-[var(--scholar-gold)]'
                                      }`}
                                    >
                                      <StickyNote className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add note</p>
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
                                      className="p-1 h-6 w-6 text-gray-400 hover:text-blue-400"
                                    >
                                      <GraduationCap className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ask The Scholar</p>
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
                                      className={`p-1 h-6 w-6 ${
                                        isBookmarked 
                                          ? 'bg-red-500/20 text-red-400' 
                                          : 'text-gray-400 hover:text-red-400'
                                      }`}
                                    >
                                      <BookmarkPlus className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}</p>
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickAction('copy');
                                      }}
                                      className="p-1 h-6 w-6 text-gray-400 hover:text-green-400"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy verse</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </span>
                            
                            {(hasNote || isBookmarked) && (
                              <span className="inline-flex items-center ml-1 space-x-1">
                                {hasNote && (
                                  <span className="inline-block w-1.5 h-1.5 bg-[var(--scholar-gold)] rounded-full opacity-60" title="Has note" />
                                )}
                                {isBookmarked && (
                                  <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full opacity-60" title="Bookmarked" />
                                )}
                              </span>
                            )}
                            
                            {index < chapterData.verses.length - 1 && ' '}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Notes section at bottom */}
                  {Object.entries(verseNotes).some(([key]) => key.startsWith(`${selectedBook}:${selectedChapter}:`)) && (
                    <div className="mt-8 pt-6 border-t border-gray-700">
                      <h3 className="text-[var(--scholar-gold)] text-lg font-semibold mb-4">Chapter Notes</h3>
                      <div className="space-y-3">
                        {Object.entries(verseNotes)
                          .filter(([key]) => key.startsWith(`${selectedBook}:${selectedChapter}:`))
                          .map(([verseKey, note]) => {
                            const verseNum = verseKey.split(':')[2];
                            return (
                              <div key={verseKey} className="bg-[var(--scholar-darker)] rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="text-[var(--scholar-gold)] text-sm font-medium">
                                      Verse {verseNum}:
                                    </span>
                                    <p className="text-gray-300 text-sm mt-1">{note}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setVerseNotes(prev => {
                                        const newNotes = { ...prev };
                                        delete newNotes[verseKey];
                                        return newNotes;
                                      });
                                    }}
                                    className="p-1 text-gray-500 hover:text-gray-300 flex-shrink-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
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
          <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[var(--scholar-gold)] flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                The Scholar Study Tools
                {selectedVerse && ` - ${selectedBook} ${selectedChapter}:${selectedVerse.verse}`}
              </DialogTitle>
            </DialogHeader>
            
            {selectedVerse && (
              <div className="space-y-6">
                {/* Selected Verse Display */}
                <div className="p-4 bg-[var(--scholar-darker)] rounded-lg border-l-4 border-[var(--scholar-gold)]">
                  <p className="text-gray-200 bible-text leading-relaxed text-lg">
                    "{selectedVerse.text}"
                  </p>
                  <p className="text-[var(--scholar-gold)] text-sm mt-2">
                    {selectedBook} {selectedChapter}:{selectedVerse.verse}
                  </p>
                </div>

                {/* Study Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* 1. Greek/Hebrew Breakdown */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('greek-hebrew')}
                  >
                    <Languages className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Greek/Hebrew</h4>
                      <p className="text-gray-400 text-sm">Original words, Strong's numbers, meanings</p>
                    </div>
                  </Button>

                  {/* 2. Cross-References */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('cross-references')}
                  >
                    <BookOpen className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Cross-References</h4>
                      <p className="text-gray-400 text-sm">Related verses by theme and keywords</p>
                    </div>
                  </Button>

                  {/* 3. Commentary Insights */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('commentary')}
                  >
                    <MessageCircle className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Scholar's Take</h4>
                      <p className="text-gray-400 text-sm">Theological & practical insights</p>
                    </div>
                  </Button>

                  {/* 4. Cultural Context */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('cultural-context')}
                  >
                    <Clock className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Cultural Context</h4>
                      <p className="text-gray-400 text-sm">Historical background & setting</p>
                    </div>
                  </Button>

                  {/* 5. Topical Tags */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('topical-tags')}
                  >
                    <Target className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Topical Tags</h4>
                      <p className="text-gray-400 text-sm">Identify & explore major themes</p>
                    </div>
                  </Button>

                  {/* 6. Sermon Tools */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('sermon-tools')}
                  >
                    <FileText className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Sermon Tools</h4>
                      <p className="text-gray-400 text-sm">Outlines, illustrations, applications</p>
                    </div>
                  </Button>

                  {/* 7. Personal Notes */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('notes')}
                  >
                    <PenTool className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Notes & Journal</h4>
                      <p className="text-gray-400 text-sm">Add personal reflections</p>
                    </div>
                  </Button>

                  {/* 8. Structural Patterns */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('structural-patterns')}
                  >
                    <Grid3X3 className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Literary Structure</h4>
                      <p className="text-gray-400 text-sm">Patterns, devices, biblical structure</p>
                    </div>
                  </Button>

                  {/* 9. Devotional Builder */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left border-gray-600 hover:border-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
                    onClick={() => handleStudyTool('devotional')}
                  >
                    <Heart className="h-5 w-5 text-[var(--scholar-gold)] mb-2" />
                    <div>
                      <h4 className="font-semibold text-white">Devotional Builder</h4>
                      <p className="text-gray-400 text-sm">Create personal devotions</p>
                    </div>
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="font-medium text-white mb-3">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('bookmark')}
                      className="border-gray-600 hover:border-[var(--scholar-gold)]"
                    >
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Bookmark
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('add-to-sermon')}
                      className="border-gray-600 hover:border-[var(--scholar-gold)]"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Sermon
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('copy')}
                      className="border-gray-600 hover:border-[var(--scholar-gold)]"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Verse
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction('share')}
                      className="border-gray-600 hover:border-[var(--scholar-gold)]"
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Add Note Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white flex items-center">
                    <StickyNote className="h-4 w-4 mr-2" />
                    Quick Note
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
            )}
          </DialogContent>
        </Dialog>

        <MobileTabBar />
      </div>
    </TooltipProvider>
  );
}