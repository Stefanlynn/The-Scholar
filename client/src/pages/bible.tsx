import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useAuth } from "@/contexts/AuthContext";
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
  ArrowLeft,
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
import PageHelp from "@/components/page-help";

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
  { value: "kjv", label: "King James Version" }
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
  const [currentStudyTool, setCurrentStudyTool] = useState<string>("");
  const [inlineScholarResponse, setInlineScholarResponse] = useState<string>("");

  const bibleHelpContent = {
    title: "How to Use Bible Study Features",
    description: "Navigate through Scripture, highlight verses, take notes, bookmark important passages, and access The Scholar's comprehensive study tools for deep biblical analysis.",
    features: [
      {
        title: "Bible Navigation",
        description: "Use the book and chapter selectors to navigate through Scripture. Search for specific verses or topics using the search bar.",
        tips: [
          "Click book/chapter dropdowns to select different Bible passages",
          "Use search to find verses containing specific words or phrases",
          "Currently supports King James Version (KJV) translation"
        ]
      },
      {
        title: "Verse Interaction",
        description: "Click on any verse number to access study tools, highlighting, bookmarking, and note-taking features.",
        tips: [
          "Hover over verses to see interactive buttons",
          "Highlight verses in different colors for visual organization",
          "Bookmark important verses for quick access later",
          "Add personal notes to capture your insights"
        ]
      },
      {
        title: "Scholar Study Tools",
        description: "Access comprehensive biblical analysis by clicking on any verse to open The Scholar's study tools.",
        tips: [
          "Choose from 8 different study focuses: Greek/Hebrew, Cross-References, Scholar's Take, Cultural Context, etc.",
          "Use 'Back to Tools' button to return to study options without closing the dialog",
          "Ask The Scholar questions about specific verses using the inline question feature"
        ]
      },
      {
        title: "Study Tool Options",
        description: "Each study tool provides different types of biblical analysis and insights.",
        tips: [
          "Greek/Hebrew: Original language analysis and Strong's numbers",
          "Cross-References: Related verses and thematic connections",
          "Scholar's Take: Theological insights and expert commentary",
          "Cultural Context: Historical background and setting",
          "Sermon Tools: Outlines, illustrations, and preaching applications"
        ]
      },
      {
        title: "Quick Actions",
        description: "Use the quick action buttons in study tools for immediate verse management.",
        tips: [
          "Bookmark: Save verses to your personal bookmark collection",
          "Copy Verse: Copy the verse text to your clipboard",
          "Share: Share verses with others",
          "Quick Note: Add personal thoughts directly to the verse"
        ]
      }
    ]
  };
  
  const [inlineScholarLoading, setInlineScholarLoading] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Save Scholar response to notes
  const saveToNotesMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; scripture: string; tags: string[] }) => {
      return apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Analysis saved to notes successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to save to notes", variant: "destructive" });
    },
  });

  // Get tool-specific title and icon
  const getStudyToolTitle = (toolType: string) => {
    const toolTitles = {
      'greek-hebrew': 'Greek / Hebrew Breakdown',
      'cross-references': 'Cross-References',
      'commentary': "The Scholar's Take",
      'cultural-context': 'Cultural & Historical Context',
      'topical-tags': 'Topical Tags',
      'sermon-tools': 'Sermon Integration Tools',
      'structural-patterns': 'Literary Structure',
      'devotional': 'Devotional Builder'
    };
    return toolTitles[toolType as keyof typeof toolTitles] || 'Biblical Analysis';
  };

  // Handle saving Scholar response to notes
  const handleSaveToNotes = () => {
    if (!scholarResponse || !currentVerseForStudy || !currentStudyTool) return;
    
    const toolTitle = getStudyToolTitle(currentStudyTool);
    const noteData = {
      title: `${toolTitle} - ${currentVerseForStudy.reference}`,
      content: scholarResponse,
      scripture: currentVerseForStudy.reference,
      tags: [currentStudyTool, 'study-tool']
    };
    
    saveToNotesMutation.mutate(noteData);
  };

  // Handle saving inline Scholar response to notes
  const handleSaveInlineToNotes = () => {
    if (!inlineScholarResponse || !selectedVerse) return;
    
    const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse.verse}`;
    const noteData = {
      title: `Scholar Response - ${verseRef}`,
      content: `Question: ${scholarQuery}\n\n${inlineScholarResponse}`,
      scripture: verseRef,
      tags: ['scholar-question', 'study-tool']
    };
    
    saveToNotesMutation.mutate(noteData);
  };

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
      queryClient.invalidateQueries({ queryKey: ["/api/profile/stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/profile/stats"] });
    }
  });

  const scholarMutation = useMutation({
    mutationFn: async (query: string) => {
      setScholarLoading(true);
      const response = await apiRequest("POST", "/api/bible/study-tools", { message: query });
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

  // Inline Scholar mutation for direct responses in study tools dialog
  const inlineScholarMutation = useMutation({
    mutationFn: async (query: string) => {
      setInlineScholarLoading(true);
      const response = await apiRequest("POST", "/api/bible/study-tools", { message: query, mode: "study" });
      return response.json();
    },
    onSuccess: (data) => {
      setInlineScholarLoading(false);
      setInlineScholarResponse(data.response || "The Scholar's response is ready.");
    },
    onError: (error) => {
      setInlineScholarLoading(false);
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
    
    // Store current verse and tool for display in dialog
    setCurrentVerseForStudy({
      reference: verseRef,
      text: verseText
    });
    setCurrentStudyTool(toolType);
    
    // Show loading immediately
    setScholarLoading(true);
    setShowScholarDialog(true);
    setScholarResponse("");
    
    let query = "";
    
    switch (toolType) {
      case 'greek-hebrew':
        query = `Provide a Greek/Hebrew word study analysis for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Greek/Hebrew Breakdown**
- *"[word/phrase]"* = **[original Hebrew/Greek]** (*transliteration*): [Strong's number if available] - [definition and theological significance]
- *"[word/phrase]"* = **[original Hebrew/Greek]** (*transliteration*): [Strong's number if available] - [definition and theological significance]

Continue for each key word. Format with bold section titles, italicized original language words, bullet points, and short scannable paragraphs. Focus only on the original language analysis.`;
        break;
        
      case 'cross-references':
        query = `Provide cross-references for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Cross References**
- **[Reference]** — [Brief description of thematic connection]
- **[Reference]** — [Brief description of keyword connection]
- **[Reference]** — [Brief description of theological connection]

Group by themes when helpful. Focus only on related Scripture passages that illuminate this verse.`;
        break;
        
      case 'commentary':
        query = `Provide theological commentary for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Scholar's Commentary**
- [Theological interpretation and significance]
- [Key insights about the meaning and application]
- [Important doctrinal or practical points]
- [How this verse fits into the broader biblical narrative]

Focus only on scholarly interpretation and commentary. Keep explanations clear and accessible.`;
        break;
        
      case 'cultural-context':
        query = `Explain the cultural and historical context for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Cultural Context**
- **Historical Setting**: [Time period, author, audience context]
- **Ancient Customs**: [Relevant cultural practices and traditions]
- **Social Context**: [Social structures, worldview, and daily life]
- **Modern Application**: [How understanding the culture affects interpretation today]

Focus only on cultural and historical background information.`;
        break;
        
      case 'topical-tags':
        query = `Identify major theological themes for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Topical Tags**
- **#[Theme]** — [Brief explanation of this theme in the verse]
- **#[Theme]** — [Brief explanation of this theme in the verse]
- **#[Theme]** — [Brief explanation of this theme in the verse]

Focus only on identifying and explaining the major themes present in this verse.`;
        break;
        
      case 'sermon-tools':
        query = `Create sermon tools for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Sermon Tools**
- **Hook**: [Attention-getting opening illustration or question]
- **Main Point**: [Central message of the verse]
- **3 Sub-Points**: 
  - [Point 1 with brief explanation]
  - [Point 2 with brief explanation] 
  - [Point 3 with brief explanation]
- **Illustration**: [Story or example that makes the truth memorable]
- **Application**: [How listeners can apply this truth in their lives]

Focus only on practical preaching tools and structure.`;
        break;
        
      case 'structural-patterns':
        query = `Analyze literary structure for "${verseText}" (${verseRef}). Use this exact format:

📖 **Verse**: ${verseRef}
"${verseText}"

**Literary Structure**
- **Word Patterns**: [Repetition, parallelism, or word arrangement]
- **Literary Devices**: [Metaphor, chiasm, or other literary techniques]
- **Passage Context**: [How this verse fits within the broader section]
- **Structural Significance**: [What the structure reveals about the meaning]

Focus only on literary and structural analysis.`;
        break;
        
      case 'devotional':
        query = `Create a personal devotional for "${verseText}" (${verseRef}). Use the structured format with:

📖 **Verse**: ${verseRef}
"${verseText}"

**Heart Connection**
- Personal, encouraging insight

**Personal Application**
- How this applies to daily life

**Identity Truth**
- What this reveals about God's love

**Reflection Questions**
> **Consider**: Thoughtful meditation question
> **Pray**: Simple prayer prompt
> **Journal**: Personal reflection writing prompt

Format with bold section titles, blockquote prompts, and short encouraging paragraphs.`;
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
      const fullQuery = `Answer this specific question about "${selectedVerse.text}" (${verseRef}): ${scholarQuery}

Please provide a direct, conversational answer to the user's question. Do not use the structured format with sections like Greek/Hebrew breakdown, cross-references, etc. Just answer the specific question they asked in a helpful, scholarly way.`;
      inlineScholarMutation.mutate(fullQuery);
      setScholarQuery(""); // Clear the question after asking
    }
  };

  const handleClearInlineResponse = () => {
    setInlineScholarResponse("");
    setScholarQuery("");
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
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-First Top Bar */}
          <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-white">Bible Study</h2>
                  <PageHelp pageName="Bible Study" helpContent={bibleHelpContent} />
                </div>
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
                <PageHelp pageName="Bible Study" helpContent={bibleHelpContent} />
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

          <div className="flex-1 overflow-y-auto scroll-smooth p-3 md:p-6 pb-20 md:pb-6 space-y-4 md:space-y-6">
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
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-200 leading-relaxed text-lg">
                        {(chapterData as any).verses.map((verse: any, index: number) => {
                          const verseKey = getVerseKey(verse);
                          const isHighlighted = highlights[verseKey];
                          const isBookmarked = bookmarks.has(verseKey);
                          const hasNote = verseNotes[verseKey];
                          
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
                                        <MessageCircle className="h-3 w-3" />
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
                              
                              {index < (chapterData as any).verses.length - 1 && ' '}
                            </span>
                          );
                        })}
                      </div>
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
            <div className="md:hidden bg-[var(--scholar-dark)] border border-gray-700 rounded-lg p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-gray-700" />
                  ))}
                </div>
              ) : (chapterData as any)?.verses ? (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-200 leading-relaxed text-base">
                    {(chapterData as any).verses.map((verse: any, index: number) => {
                      const verseKey = getVerseKey(verse);
                      const isHighlighted = highlights[verseKey];
                      const isBookmarked = bookmarks.has(verseKey);
                      const hasNote = verseNotes[verseKey];
                      
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
                                    <MessageCircle className="h-3 w-3" />
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
                          
                          {index < (chapterData as any).verses.length - 1 && ' '}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center">
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
                      <GraduationCap className="h-7 w-7 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
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
                      disabled={!scholarQuery.trim() || inlineScholarMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 font-medium"
                    >
                      {inlineScholarMutation.isPending ? 'Asking...' : 'Ask The Scholar'}
                    </Button>
                    
                    {/* Inline Scholar Response */}
                    {(inlineScholarLoading || inlineScholarResponse) && (
                      <div className="mt-6 p-4 bg-[var(--scholar-darker)] border border-[var(--scholar-gold)]/20 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-[var(--scholar-gold)] font-semibold text-sm">The Scholar's Response</h5>
                          {inlineScholarResponse && (
                            <div className="flex items-center space-x-2">
                              <Button 
                                onClick={handleClearInlineResponse}
                                size="sm"
                                className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs border-0"
                              >
                                New Question
                              </Button>
                              <Button 
                                onClick={handleSaveInlineToNotes}
                                disabled={saveToNotesMutation.isPending}
                                size="sm"
                                className="bg-[var(--scholar-gold)] text-black hover:bg-[var(--scholar-gold)]/90 text-xs"
                              >
                                {saveToNotesMutation.isPending ? 'Saving...' : 'Save to Notes'}
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {inlineScholarLoading ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-[var(--scholar-gold)] text-sm">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--scholar-gold)]"></div>
                              <span>The Scholar is analyzing your question...</span>
                            </div>
                            <Skeleton className="h-3 w-full bg-gray-600" />
                            <Skeleton className="h-3 w-3/4 bg-gray-600" />
                            <Skeleton className="h-3 w-1/2 bg-gray-600" />
                          </div>
                        ) : (
                          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {inlineScholarResponse}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Scholar Response Dialog */}
        <Dialog open={showScholarDialog} onOpenChange={setShowScholarDialog}>
          <DialogContent className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/30 text-white max-w-md w-[90vw] max-h-[70vh] overflow-y-auto" hideCloseButton>
            <DialogHeader className="pb-3">
              <DialogTitle className="text-[var(--scholar-gold)] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {currentStudyTool ? getStudyToolTitle(currentStudyTool) : "The Scholar's Analysis"}
                </div>
                <Button
                  onClick={() => {
                    setShowScholarDialog(false);
                    setScholarResponse("");
                    setCurrentStudyTool(null);
                    // Keep the main study tools dialog open by not clearing selectedVerse
                  }}
                  variant="outline"
                  size="sm"
                  className="bg-[var(--scholar-darker)] border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10 hover:border-[var(--scholar-gold)]/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Tools
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Verse Reference Display */}
              {currentVerseForStudy && (
                <div className="p-3 bg-[var(--scholar-darker)] rounded border border-[var(--scholar-gold)]/20">
                  <p className="text-[var(--scholar-gold)] text-sm font-medium mb-1">
                    {currentVerseForStudy.reference}
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed italic">
                    "{currentVerseForStudy.text}"
                  </p>
                </div>
              )}
            
              {/* Scholar Response Content */}
              {scholarLoading ? (
                <div className="border border-gray-700 rounded p-3 bg-[var(--scholar-darker)]/30">
                  <div className="flex items-center space-x-3 text-[var(--scholar-gold)] mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--scholar-gold)]"></div>
                    <span className="text-sm">Analyzing Scripture...</span>
                  </div>
                  <Skeleton className="h-3 w-full bg-gray-700 mb-2" />
                  <Skeleton className="h-3 w-3/4 bg-gray-700 mb-2" />
                  <Skeleton className="h-3 w-1/2 bg-gray-700" />
                </div>
              ) : scholarResponse && (
                <div className="border border-gray-700 rounded p-3 bg-[var(--scholar-darker)]/30">
                  <h4 className="text-white font-medium text-sm mb-2">Analysis</h4>
                  <div className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">
                    {scholarResponse}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              {scholarResponse && (
                <div className="mt-3 flex gap-2">
                  <Button 
                    onClick={handleSaveToNotes}
                    disabled={saveToNotesMutation.isPending}
                    size="sm"
                    className="bg-[var(--scholar-gold)] text-black hover:bg-[var(--scholar-gold)]/90 text-xs"
                  >
                    {saveToNotesMutation.isPending ? 'Saving...' : 'Save to Notes'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </TooltipProvider>
  );
}
