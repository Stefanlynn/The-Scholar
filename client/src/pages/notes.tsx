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

// Sermon Workspace Component (simplified for now)
function SermonWorkspace() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Sermon Workspace</h2>
      </div>
      <Card className="bg-gradient-to-br from-[var(--scholar-gold)]/20 to-orange-500/20 border-[var(--scholar-gold)]/50 p-8 text-center">
        <div className="w-16 h-16 bg-[var(--scholar-gold)]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-[var(--scholar-gold)]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Sermon Builder</h3>
        <p className="text-gray-400 mb-6">Create powerful sermons with AI assistance, multiple writing modes, and preaching style adaptation</p>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-amber-500 hover:from-amber-500 hover:to-[var(--scholar-gold)] text-black">
          Start Building Sermon
        </Button>
      </Card>
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
              <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="title"
                      placeholder="Note title"
                      defaultValue={editingNote?.title || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      name="content"
                      placeholder="Write your note here..."
                      defaultValue={editingNote?.content || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white min-h-[200px] resize-none"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="tags"
                      placeholder="Tags (comma-separated)"
                      defaultValue={editingNote?.tags?.join(", ") || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 w-full"
                    disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  >
                    {editingNote ? "Update Note" : "Create Note"}
                  </Button>
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