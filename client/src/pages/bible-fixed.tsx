import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getBibleChapter } from "@/lib/api";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Highlighter, 
  BookmarkPlus, 
  GraduationCap,
  StickyNote,
  Languages,
  BookOpen,
  Clock,
  Target,
  FileText,
  PenTool,
  Copy,
  MessageCircle
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
  { value: 'kjv', label: 'KJV' },
  { value: 'niv', label: 'NIV' },
  { value: 'esv', label: 'ESV' },
  { value: 'nlt', label: 'NLT' },
  { value: 'nasb', label: 'NASB' }
];

const studyTools = [
  { id: 'original-languages', title: 'Greek/Hebrew', icon: Languages, description: 'Original words and meanings' },
  { id: 'cross-references', title: 'Cross References', icon: BookOpen, description: 'Related scriptures' },
  { id: 'historical-context', title: 'Historical Context', icon: Clock, description: 'Background and setting' },
  { id: 'application', title: 'Application', icon: Target, description: 'Apply to your life' },
  { id: 'commentary', title: 'Commentary', icon: FileText, description: 'Scholarly insights' },
  { id: 'sermon-prep', title: 'Sermon Prep', icon: PenTool, description: 'Teaching materials' }
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState("Matthew");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [verseNotes, setVerseNotes] = useState<Record<string, string>>({});
  const [verseNote, setVerseNote] = useState("");
  const [showScholarDialog, setShowScholarDialog] = useState(false);
  const [scholarResponse, setScholarResponse] = useState("");
  const [scholarLoading, setScholarLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ['/api/bible', selectedBook, selectedChapter, selectedTranslation],
    queryFn: () => getBibleChapter(selectedBook, selectedChapter, selectedTranslation),
    enabled: !!selectedBook && !!selectedChapter
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/bible/search', searchQuery],
    queryFn: () => apiRequest(`/api/bible/search?q=${encodeURIComponent(searchQuery)}`),
    enabled: searchQuery.length > 2
  });

  const scholarMutation = useMutation({
    mutationFn: (query: string) =>
      apiRequest('/api/chat/messages', {
        method: 'POST',
        body: { message: query }
      }),
    onSuccess: (response) => {
      setScholarResponse(response.message || "No response received");
      setScholarLoading(false);
    },
    onError: () => {
      toast({ title: "Failed to get Scholar response", variant: "destructive" });
      setScholarLoading(false);
    }
  });

  const noteMutation = useMutation({
    mutationFn: ({ verseKey, note }: { verseKey: string, note: string }) =>
      apiRequest('/api/notes', {
        method: 'POST',
        body: { title: `Note on ${verseKey}`, content: note, verseReference: verseKey }
      }),
    onSuccess: () => {
      toast({ title: "Note saved successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    }
  });

  const handleNextChapter = () => setSelectedChapter(prev => prev + 1);
  const handlePreviousChapter = () => {
    if (selectedChapter > 1) setSelectedChapter(prev => prev - 1);
  };

  const handleVerseClick = (verse: any) => setSelectedVerse(verse);

  const getVerseKey = (verse: any) => `${selectedBook}:${selectedChapter}:${verse.verse}`;

  const handleStudyTool = (toolId: string) => {
    setShowScholarDialog(true);
    const verseRef = `${selectedBook} ${selectedChapter}:${selectedVerse?.verse}`;
    const verseText = selectedVerse?.text;
    
    let query = "";
    switch (toolId) {
      case 'original-languages':
        query = `Please provide detailed Greek and Hebrew word studies for key terms in ${verseRef}: "${verseText}". Include Strong's numbers, original meanings, and theological significance.`;
        break;
      case 'cross-references':
        query = `What are the most important cross-references for ${verseRef}: "${verseText}"? Show how this connects to other Scripture.`;
        break;
      case 'historical-context':
        query = `What is the historical and cultural context of ${verseRef}: "${verseText}"? Help me understand the background.`;
        break;
      case 'application':
        query = `How can I apply ${verseRef}: "${verseText}" to my life today? What does this mean for believers?`;
        break;
      case 'commentary':
        query = `Please provide biblical commentary on ${verseRef}: "${verseText}". What do theologians say about this?`;
        break;
      case 'sermon-prep':
        query = `Help me prepare a sermon on ${verseRef}: "${verseText}". Provide outline, points, and applications.`;
        break;
    }
    
    setScholarLoading(true);
    scholarMutation.mutate(query);
  };

  const handleAddNote = () => {
    if (!selectedVerse || !verseNote.trim()) return;
    const verseKey = getVerseKey(selectedVerse);
    setVerseNotes(prev => ({ ...prev, [verseKey]: verseNote }));
    noteMutation.mutate({ verseKey, note: verseNote });
    setVerseNote("");
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
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
            
            <div className="hidden md:flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Bible Study</h2>
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

            {/* Mobile Book/Chapter Selection */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-between">
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger className="flex-1 bg-[var(--scholar-darker)] border-gray-600 text-white mr-2">
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
                  <SelectTrigger className="w-20 bg-[var(--scholar-darker)] border-gray-600 text-white">
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
                    <div className="space-y-6">
                      {/* Continuous Text Display */}
                      <div className="bg-white/5 p-6 rounded-lg">
                        <p className="text-gray-200 leading-relaxed text-lg bible-text">
                          {(chapterData as any).verses.map((verse: any, index: number) => {
                            const verseKey = getVerseKey(verse);
                            const isHighlighted = highlights[verseKey];
                            
                            return (
                              <span key={verse.verse} className="inline">
                                <span
                                  className={`cursor-pointer hover:bg-gray-700/30 rounded px-1 py-0.5 transition-colors ${
                                    isHighlighted ? 'bg-yellow-400/30' : ''
                                  }`}
                                  onClick={() => handleVerseClick(verse)}
                                  title={`${selectedBook} ${selectedChapter}:${verse.verse} - Click to interact`}
                                >
                                  <sup className="text-[var(--scholar-gold)] font-semibold text-sm mr-1 select-none">
                                    {verse.verse}
                                  </sup>
                                  {verse.text}
                                </span>
                                {index < (chapterData as any).verses.length - 1 && " "}
                              </span>
                            );
                          })}
                        </p>
                      </div>
                      
                      {/* Chapter Tools */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]"
                        >
                          <Highlighter className="h-4 w-4 mr-2" />
                          Highlight verses
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]"
                        >
                          <StickyNote className="h-4 w-4 mr-2" />
                          Add notes
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400"
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Ask Scholar
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]"
                          onClick={() => {
                            const chapterText = (chapterData as any).verses.map((v: any) => `${v.verse} ${v.text}`).join(' ');
                            navigator.clipboard.writeText(`${selectedBook} ${selectedChapter}\n\n${chapterText}`);
                            toast({ title: "Chapter copied to clipboard" });
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy chapter
                        </Button>
                      </div>
                      
                      <p className="text-gray-400 text-sm">
                        Click any verse number to highlight, add notes, or ask The Scholar about it.
                      </p>
                      
                      {/* Notes Display */}
                      {Object.entries(verseNotes).some(([key]) => key.startsWith(`${selectedBook}:${selectedChapter}:`)) && (
                        <div className="pt-4 border-t border-gray-700">
                          <h4 className="text-[var(--scholar-gold)] font-semibold mb-3 flex items-center">
                            <StickyNote className="h-4 w-4 mr-2" />
                            Chapter Notes
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(verseNotes)
                              .filter(([key]) => key.startsWith(`${selectedBook}:${selectedChapter}:`))
                              .map(([verseKey, note]) => {
                                const verseNum = verseKey.split(':')[2];
                                return (
                                  <div key={verseKey} className="bg-[var(--scholar-darker)] p-3 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                      <span className="text-[var(--scholar-gold)] font-semibold text-sm min-w-[2rem]">
                                        v{verseNum}
                                      </span>
                                      <p className="text-gray-300 text-sm flex-1">{note}</p>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scholar Study Tools Dialog */}
        <Dialog open={!!selectedVerse} onOpenChange={() => setSelectedVerse(null)}>
          <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[var(--scholar-gold)] flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Study Tools - {selectedBook} {selectedChapter}:{selectedVerse?.verse}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Selected Verse Display */}
              <div className="bg-[var(--scholar-darker)] p-4 rounded-lg">
                <div className="text-[var(--scholar-gold)] font-semibold mb-2">
                  {selectedBook} {selectedChapter}:{selectedVerse?.verse}
                </div>
                <p className="text-gray-200 leading-relaxed">{selectedVerse?.text}</p>
              </div>

              {/* Study Tools Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {studyTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="h-auto p-4 border-gray-600 hover:border-[var(--scholar-gold)] flex flex-col items-center space-y-2"
                    onClick={() => handleStudyTool(tool.id)}
                  >
                    <tool.icon className="h-6 w-6 text-[var(--scholar-gold)]" />
                    <div className="text-center">
                      <div className="font-medium text-white">{tool.title}</div>
                      <div className="text-xs text-gray-400">{tool.description}</div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:border-yellow-400"
                  onClick={() => {
                    const verseKey = getVerseKey(selectedVerse);
                    setHighlights(prev => ({ ...prev, [verseKey]: 'yellow' }));
                    toast({ title: "Verse highlighted" });
                  }}
                >
                  <Highlighter className="h-4 w-4 mr-2" />
                  Highlight
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:border-blue-400"
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:border-green-400"
                >
                  <StickyNote className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 hover:border-purple-400"
                  onClick={() => {
                    setShowScholarDialog(true);
                    const quickQuery = `Please explain ${selectedBook} ${selectedChapter}:${selectedVerse?.verse}: "${selectedVerse?.text}"`;
                    setScholarLoading(true);
                    scholarMutation.mutate(quickQuery);
                  }}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Ask Scholar
                </Button>
              </div>

              {/* Add Note Section */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Add Note</h4>
                <Textarea
                  placeholder="Write your note or reflection..."
                  value={verseNote}
                  onChange={(e) => setVerseNote(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!verseNote.trim() || noteMutation.isPending}
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400"
                >
                  {noteMutation.isPending ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Scholar Response Dialog */}
        <Dialog open={showScholarDialog} onOpenChange={setShowScholarDialog}>
          <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[var(--scholar-gold)] flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                The Scholar
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {scholarLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </div>
              ) : scholarResponse ? (
                <div className="bg-[var(--scholar-darker)] p-4 rounded-lg">
                  <div className="text-gray-200 whitespace-pre-wrap">{scholarResponse}</div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowScholarDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <MobileTabBar />
      </div>
    </TooltipProvider>
  );
}