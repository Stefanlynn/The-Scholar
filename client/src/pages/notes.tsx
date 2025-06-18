import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, FileText, PenTool, Mic, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotebookPen } from "lucide-react";
import PageHelp from "@/components/page-help";
import { apiRequest } from "@/lib/queryClient";
import type { Note, InsertNote } from "@shared/schema";

// Sermon Workspace Component with full functionality
function SermonWorkspace() {
  const [currentSermon, setCurrentSermon] = useState({
    title: "",
    scripture: "",
    theme: "",
    body: "",
    outline: ""
  });
  const [writingMode, setWritingMode] = useState<'outline' | 'manuscript' | 'bullets'>('outline');
  const [preachingStyle, setPreachingStyle] = useState<'prophetic' | 'teaching' | 'evangelistic' | 'youth' | 'devotional'>('teaching');
  const [selectedText, setSelectedText] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [showOutlineBuilder, setShowOutlineBuilder] = useState(false);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const handleEnhancement = async (action: string) => {
    if (!selectedText.trim()) {
      alert("Please select text first to enhance it.");
      return;
    }

    setEnhanceLoading(true);
    setPreviousContent(currentSermon.body);

    try {
      const response = await fetch('/api/chat/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          action: action,
          style: preachingStyle,
          context: currentSermon.theme
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const enhancedText = data.response;
        
        // Replace selected text with enhanced version
        const newBody = currentSermon.body.replace(selectedText, enhancedText);
        setCurrentSermon(prev => ({ ...prev, body: newBody }));
        setSelectedText("");
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setEnhanceLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousContent) {
      setCurrentSermon(prev => ({ ...prev, body: previousContent }));
      setPreviousContent("");
    }
  };

  const handleStyleRewrite = async () => {
    if (!currentSermon.body.trim()) {
      alert("Please write some content first before applying a style.");
      return;
    }

    setEnhanceLoading(true);
    setPreviousContent(currentSermon.body);

    try {
      const response = await fetch('/api/chat/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentSermon.body,
          action: 'rewrite_style',
          style: preachingStyle,
          context: currentSermon.theme,
          title: currentSermon.title,
          scripture: currentSermon.scripture
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSermon(prev => ({ ...prev, body: data.response }));
      }
    } catch (error) {
      console.error('Style rewrite failed:', error);
    } finally {
      setEnhanceLoading(false);
    }
  };

  const copyContent = () => {
    const fullSermon = `${currentSermon.title}\n\nScripture: ${currentSermon.scripture}\nTheme: ${currentSermon.theme}\n\n${currentSermon.body}`;
    navigator.clipboard.writeText(fullSermon);
  };

  const downloadSermon = () => {
    const fullSermon = `${currentSermon.title}\n\nScripture: ${currentSermon.scripture}\nTheme: ${currentSermon.theme}\n\n${currentSermon.body}`;
    const blob = new Blob([fullSermon], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSermon.title || 'sermon'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Sermon Workspace</h2>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowOutlineBuilder(!showOutlineBuilder)}
            variant="outline"
            className="border-[var(--scholar-gold)]/50 text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
          >
            {showOutlineBuilder ? "Hide Outline" : "Outline Builder"}
          </Button>
          <Button
            onClick={copyContent}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
          >
            Copy All
          </Button>
          <Button
            onClick={downloadSermon}
            className="bg-gradient-to-r from-[var(--scholar-gold)] to-amber-500 hover:from-amber-500 hover:to-[var(--scholar-gold)] text-black"
          >
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sermon Details */}
          <Card className="bg-black/80 border-[var(--scholar-gold)]/50 hover:border-[var(--scholar-gold)]/70 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <Input
                placeholder="Sermon Title"
                value={currentSermon.title}
                onChange={(e) => setCurrentSermon(prev => ({ ...prev, title: e.target.value }))}
                className="bg-black/70 border-[var(--scholar-gold)]/30 text-white text-lg font-semibold placeholder-gray-400 focus:border-[var(--scholar-gold)]/70"
              />
              <Input
                placeholder="Scripture Reference (e.g., John 3:16-21)"
                value={currentSermon.scripture}
                onChange={(e) => setCurrentSermon(prev => ({ ...prev, scripture: e.target.value }))}
                className="bg-black/70 border-[var(--scholar-gold)]/30 text-white placeholder-gray-400 focus:border-[var(--scholar-gold)]/70"
              />
              <Input
                placeholder="Main Theme or Focus"
                value={currentSermon.theme}
                onChange={(e) => setCurrentSermon(prev => ({ ...prev, theme: e.target.value }))}
                className="bg-black/70 border-[var(--scholar-gold)]/30 text-white placeholder-gray-400 focus:border-[var(--scholar-gold)]/70"
              />
            </CardContent>
          </Card>

          {/* Writing Mode & Style Selector */}
          <Card className="bg-black/80 border-[var(--scholar-gold)]/50 hover:border-[var(--scholar-gold)]/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Writing Mode */}
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Writing Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'outline', label: 'Outline', desc: 'Structured points' },
                      { value: 'manuscript', label: 'Full Text', desc: 'Complete sermon' },
                      { value: 'bullets', label: 'Bullets', desc: 'Key points only' }
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setWritingMode(mode.value as any)}
                        className={`p-3 rounded-lg text-sm transition-all ${
                          writingMode === mode.value
                            ? 'bg-[var(--scholar-gold)]/40 border border-[var(--scholar-gold)]/70 text-white shadow-lg'
                            : 'bg-gray-800/30 border border-gray-600/30 text-gray-300 hover:text-white hover:bg-gray-700/50 hover:border-gray-500/50'
                        }`}
                      >
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs opacity-75">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preaching Style */}
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Preaching Style</label>
                  <select
                    value={preachingStyle}
                    onChange={(e) => setPreachingStyle(e.target.value as any)}
                    className="w-full p-3 bg-gray-900/50 border border-[var(--scholar-gold)]/30 rounded-lg text-white focus:border-[var(--scholar-gold)]/70"
                  >
                    <option value="prophetic">Prophetic - Bold & Revelatory</option>
                    <option value="teaching">Teaching - Educational & Deep</option>
                    <option value="evangelistic">Evangelistic - Salvation Focus</option>
                    <option value="youth">Youth/Modern - Engaging & Relevant</option>
                    <option value="devotional">Devotional - Heart & Worship</option>
                  </select>
                  <Button
                    onClick={handleStyleRewrite}
                    disabled={enhanceLoading || !currentSermon.body.trim()}
                    className="w-full mt-3 bg-gradient-to-r from-[var(--scholar-gold)] to-amber-500 hover:from-amber-500 hover:to-[var(--scholar-gold)] text-black shadow-lg"
                  >
                    {enhanceLoading ? "Rewriting..." : "Rewrite in Selected Style"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Text Editor */}
          <Card className="bg-gray-900/90 border-gray-600/50 hover:border-gray-500/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sermon Content</h3>
                <div className="flex items-center space-x-2">
                  {previousContent && (
                    <Button
                      onClick={handleUndo}
                      variant="outline"
                      size="sm"
                      className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400/70"
                    >
                      Undo
                    </Button>
                  )}
                  {selectedText && (
                    <Badge variant="secondary" className="bg-blue-500/30 text-blue-300 text-xs shadow-lg">
                      Text Selected
                    </Badge>
                  )}
                </div>
              </div>
              
              <Textarea
                placeholder={
                  writingMode === 'outline' 
                    ? "I. Introduction\n   A. Hook/Opening\n   B. Context\n\nII. Main Point 1\n   A. Scripture\n   B. Application\n\nIII. Conclusion\n   A. Summary\n   B. Call to Action"
                    : writingMode === 'manuscript'
                    ? "Write your complete sermon manuscript here. Select text and use the AI tools to enhance specific sections..."
                    : "• Opening thought\n• Key point 1\n• Key point 2\n• Closing application"
                }
                value={currentSermon.body}
                onChange={(e) => setCurrentSermon(prev => ({ ...prev, body: e.target.value }))}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                className="bg-black/80 border-gray-600/50 text-white min-h-[400px] resize-none text-sm leading-relaxed placeholder-gray-500 focus:border-gray-400/70 focus:ring-1 focus:ring-gray-400/30"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          {/* AI Enhancement Tools */}
          <Card className="bg-slate-800/90 border-slate-600/50 hover:border-slate-500/70 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Enhancement Tools</h3>
              <p className="text-sm text-gray-300 mb-4">Select text in your sermon, then use these tools:</p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleEnhancement('expand')}
                  disabled={enhanceLoading || !selectedText}
                  className="w-full bg-green-600/30 border border-green-500/50 text-green-200 hover:bg-green-600/40 hover:border-green-400/70 disabled:opacity-50 shadow-lg"
                >
                  {enhanceLoading ? "Enhancing..." : "Expand Point"}
                </Button>
                
                <Button
                  onClick={() => handleEnhancement('clarify')}
                  disabled={enhanceLoading || !selectedText}
                  className="w-full bg-blue-600/30 border border-blue-500/50 text-blue-200 hover:bg-blue-600/40 hover:border-blue-400/70 disabled:opacity-50 shadow-lg"
                >
                  {enhanceLoading ? "Enhancing..." : "Rewrite Clearly"}
                </Button>
                
                <Button
                  onClick={() => handleEnhancement('add_verse')}
                  disabled={enhanceLoading || !selectedText}
                  className="w-full bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600/40 hover:border-purple-400/70 disabled:opacity-50 shadow-lg"
                >
                  {enhanceLoading ? "Enhancing..." : "Add Supporting Verse"}
                </Button>
                
                <Button
                  onClick={() => handleEnhancement('add_story')}
                  disabled={enhanceLoading || !selectedText}
                  className="w-full bg-orange-600/30 border border-orange-500/50 text-orange-200 hover:bg-orange-600/40 hover:border-orange-400/70 disabled:opacity-50 shadow-lg"
                >
                  {enhanceLoading ? "Enhancing..." : "Add Illustration"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outline Builder */}
          {showOutlineBuilder && (
            <Card className="bg-slate-800/90 border-[var(--scholar-gold)]/50 hover:border-[var(--scholar-gold)]/70 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preaching Outline</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-[var(--scholar-gold)]/10 border border-[var(--scholar-gold)]/20 rounded-lg">
                    <div className="font-semibold text-[var(--scholar-gold)] mb-1">Title:</div>
                    <div className="text-white">{currentSermon.title || "(Add sermon title)"}</div>
                  </div>
                  
                  <div className="p-3 bg-[var(--scholar-gold)]/10 border border-[var(--scholar-gold)]/20 rounded-lg">
                    <div className="font-semibold text-[var(--scholar-gold)] mb-1">Text:</div>
                    <div className="text-white">{currentSermon.scripture || "(Add scripture reference)"}</div>
                  </div>
                  
                  <div className="p-3 bg-[var(--scholar-gold)]/10 border border-[var(--scholar-gold)]/20 rounded-lg">
                    <div className="font-semibold text-[var(--scholar-gold)] mb-1">Theme:</div>
                    <div className="text-white">{currentSermon.theme || "(Add main theme)"}</div>
                  </div>
                  
                  <div className="p-3 bg-[var(--scholar-gold)]/10 border border-[var(--scholar-gold)]/20 rounded-lg">
                    <div className="font-semibold text-[var(--scholar-gold)] mb-1">Structure:</div>
                    <div className="text-gray-200 text-xs space-y-1">
                      <div>I. Introduction</div>
                      <div>II. Point 1</div>
                      <div>III. Point 2</div>
                      <div>IV. Point 3</div>
                      <div>V. Call to Action</div>
                      <div>VI. Closing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Notes() {
  const [activeTab, setActiveTab] = useState<'notes' | 'journal' | 'sermon'>('notes');
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: InsertNote) => {
      const response = await apiRequest("/api/notes", { 
        method: "POST", 
        body: noteData 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      setEditingNote(null);
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...noteData }: { id: number } & Partial<InsertNote>) => {
      const response = await apiRequest(`/api/notes/${id}`, {
        method: "PATCH",
        body: noteData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      setEditingNote(null);
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/notes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });

  // Filter notes based on search and type
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    
    let filtered = notes.filter((note) => {
      const matchesSearch = searchQuery === "" || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'notes' 
        ? !note.tags?.includes('journal')
        : note.tags?.includes('journal');
      
      return matchesSearch && matchesTab;
    });
    
    return filtered;
  }, [notes, searchQuery, activeTab]);

  const manualNotes = notes?.filter((note) => !note.tags?.includes('journal')) || [];
  const journalNotes = notes?.filter((note) => note.tags?.includes('journal')) || [];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tagsStr = formData.get("tags") as string;
    const tags = tagsStr ? tagsStr.split(",").map(tag => tag.trim()) : [];

    if (activeTab === 'journal' && !tags.includes('journal')) {
      tags.push('journal');
    }

    const noteData: InsertNote = { title, content, tags };

    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote.id, ...noteData });
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[var(--scholar-dark)] via-gray-900 to-indigo-950 px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--scholar-gold)] to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <NotebookPen className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent">
                  Notes & Sermons
                </h1>
                <p className="text-gray-400 text-lg mt-2">Capture insights, build sermons, grow in wisdom</p>
              </div>
            </div>
            <PageHelp 
              pageName="Notes"
              helpContent={{
                title: "Notes & Sermon Workspace Help",
                description: "Manage your study notes, daily journal entries, and sermon preparation in one place.",
                features: [
                  {
                    title: "Study Notes",
                    description: "Create and organize your biblical study notes",
                    tips: ["Use tags to categorize your notes", "Search across all your content", "Edit notes anytime with the menu"]
                  },
                  {
                    title: "Daily Journal",
                    description: "Record your daily spiritual insights and reflections",
                    tips: ["Write regularly for spiritual growth", "Tag entries by topic or theme", "Review past entries for patterns"]
                  },
                  {
                    title: "Sermon Workspace",
                    description: "Professional sermon preparation with AI assistance",
                    tips: ["Choose your writing mode: Outline, Full Manuscript, or Bullets", "Select text and use AI tools to enhance your content", "Use voice styles to match your preaching approach", "Download or copy your finished sermon"]
                  }
                ]
              }}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div 
              onClick={() => setActiveTab('notes')}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                activeTab === 'notes' 
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/50' 
                  : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Study Notes</h3>
                  <p className="text-sm text-gray-400">{manualNotes.length} notes</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('journal')}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                activeTab === 'journal' 
                  ? 'bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/50' 
                  : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Daily Journal</h3>
                  <p className="text-sm text-gray-400">{journalNotes.length} entries</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => setActiveTab('sermon')}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                activeTab === 'sermon' 
                  ? 'bg-gradient-to-br from-[var(--scholar-gold)]/20 to-orange-500/20 border border-[var(--scholar-gold)]/50' 
                  : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--scholar-gold)]/20 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-[var(--scholar-gold)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Sermon Workspace</h3>
                  <p className="text-sm text-gray-400">Build sermons with AI</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Add */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your notes and sermons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--scholar-gold)]/50 focus:border-[var(--scholar-gold)]/50"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-[var(--scholar-gold)] to-amber-500 hover:from-amber-500 hover:to-[var(--scholar-gold)] text-black font-semibold px-6 py-3 rounded-xl shadow-lg"
                  onClick={() => setEditingNote(null)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-gray-700/50 backdrop-blur-xl text-white max-w-2xl shadow-2xl">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent">
                    {editingNote ? "Edit Note" : "Create New Note"}
                  </DialogTitle>
                  <p className="text-gray-400 text-sm mt-2">
                    {activeTab === 'journal' 
                      ? "Capture your daily spiritual insights and reflections"
                      : "Record your biblical study notes and discoveries"
                    }
                  </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Title</label>
                    <Input
                      name="title"
                      placeholder={activeTab === 'journal' ? "Today's reflection title..." : "Study topic or passage..."}
                      defaultValue={editingNote?.title || ""}
                      className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Content</label>
                    <Textarea
                      name="content"
                      placeholder={
                        activeTab === 'journal' 
                          ? "What is God speaking to your heart today? Write your thoughts, prayers, and insights..."
                          : "Record your study notes, insights, and key takeaways from Scripture..."
                      }
                      defaultValue={editingNote?.content || ""}
                      className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 min-h-[200px] resize-none leading-relaxed"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tags</label>
                    <Input
                      name="tags"
                      placeholder={activeTab === 'journal' ? "gratitude, prayer, growth..." : "prayer, prophecy, wisdom..."}
                      defaultValue={editingNote?.tags?.join(", ") || ""}
                      className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                    />
                    <p className="text-xs text-gray-500">Separate tags with commas to organize your notes</p>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className={`flex-1 font-semibold shadow-lg ${
                        activeTab === 'journal' 
                          ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                      disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                    >
                      {createNoteMutation.isPending || updateNoteMutation.isPending 
                        ? "Saving..." 
                        : editingNote ? "Update Note" : "Create Note"
                      }
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content with Library-style Layout */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          
          {/* Study Notes Section */}
          {activeTab === 'notes' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Study Notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
                    <p className="text-gray-400 mb-6">Start capturing your biblical insights and study notes</p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Button>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <Card key={note.id} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700/50 hover:border-blue-500/70 transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-white text-lg">{note.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[var(--scholar-dark)] border-gray-700">
                              <DropdownMenuItem 
                                onClick={() => { setEditingNote(note); setIsDialogOpen(true); }}
                                className="text-gray-300 hover:text-white"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteNoteMutation.mutate(note.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{note.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {note.tags?.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                                {tag}
                              </Badge>
                            ))}
                            {note.tags && note.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-gray-500/20 text-gray-400">
                                +{note.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Journal Section */}
          {activeTab === 'journal' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Daily Journal</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <PenTool className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No journal entries yet</h3>
                    <p className="text-gray-400 mb-6">Begin your spiritual journey with daily reflections</p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Start Journaling
                    </Button>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <Card key={note.id} className="bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-700/50 hover:border-green-500/70 transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-white text-lg">{note.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[var(--scholar-dark)] border-gray-700">
                              <DropdownMenuItem 
                                onClick={() => { setEditingNote(note); setIsDialogOpen(true); }}
                                className="text-gray-300 hover:text-white"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteNoteMutation.mutate(note.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{note.content}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">
                            Journal Entry
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Sermon Workspace */}
          {activeTab === 'sermon' && <SermonWorkspace />}
        </div>
      </div>
    </div>
  );
}