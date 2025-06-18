import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  PenTool, 
  BookOpen, 
  Star, 
  Calendar, 
  Clock, 
  Grid3X3, 
  List, 
  Filter,
  MessageSquareText, 
  NotebookPen, 
  HelpCircle, 
  BookmarkCheck, 
  Lightbulb, 
  Quote, 
  Archive, 
  TrendingUp, 
  Sparkles,
  Heart,
  Zap,
  Target
} from "lucide-react";
import type { Note } from "@shared/schema";
import PageHelp from "@/components/page-help";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showHelp, setShowHelp] = useState(false);
  const { toast } = useToast();

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Note>) => {
      return apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      toast({ title: "Note created successfully" });
    },
  });

  // Update note mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Note> }) => {
      return apiRequest("PATCH", `/api/notes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsDialogOpen(false);
      toast({ title: "Note updated successfully" });
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note deleted successfully" });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      scripture: formData.get("scripture") as string,
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()).filter(Boolean),
    };

    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === "all") return matchesSearch;
    if (activeCategory === "recent") {
      const isRecent = new Date(note.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
      return matchesSearch && isRecent;
    }
    if (activeCategory === "scripture" && note.scripture) return matchesSearch;
    if (activeCategory === "journal") {
      const isJournal = note.tags?.some(tag => 
        tag.toLowerCase().includes("journal") || 
        tag.toLowerCase().includes("devotion") ||
        tag.toLowerCase().includes("prayer")
      );
      return matchesSearch && isJournal;
    }
    
    return matchesSearch;
  });

  const categories = [
    { id: "all", name: "All Notes", icon: FileText, count: notes.length },
    { id: "recent", name: "Recent", icon: Clock, count: notes.filter(n => new Date(n.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length },
    { id: "scripture", name: "Scripture", icon: BookOpen, count: notes.filter(n => n.scripture).length },
    { id: "journal", name: "Journal", icon: Heart, count: notes.filter(n => n.tags?.some(tag => tag.toLowerCase().includes("journal") || tag.toLowerCase().includes("devotion"))).length },
  ];

  const quickActions = [
    {
      title: "Study Note",
      description: "Create a biblical study note",
      icon: BookOpen,
      color: "bg-blue-500/20 text-blue-400",
      action: () => {
        setEditingNote(null);
        setIsDialogOpen(true);
      }
    },
    {
      title: "Daily Journal",
      description: "Write a devotional reflection",
      icon: Heart,
      color: "bg-pink-500/20 text-pink-400",
      action: () => {
        setEditingNote(null);
        setIsDialogOpen(true);
      }
    },
    {
      title: "Sermon Notes",
      description: "Take notes during a sermon",
      icon: MessageSquareText,
      color: "bg-purple-500/20 text-purple-400",
      action: () => {
        setEditingNote(null);
        setIsDialogOpen(true);
      }
    },
    {
      title: "Prayer List",
      description: "Create a prayer request list",
      icon: Star,
      color: "bg-yellow-500/20 text-yellow-400",
      action: () => {
        setEditingNote(null);
        setIsDialogOpen(true);
      }
    }
  ];

  const featuredContent = [
    {
      title: "Recent Study Sessions",
      description: "Your latest biblical insights and reflections",
      icon: TrendingUp,
      gradient: "from-blue-600 to-purple-600",
      notes: filteredNotes.slice(0, 3)
    },
    {
      title: "Scripture Notes",
      description: "Notes connected to specific Bible passages",
      icon: BookOpen,
      gradient: "from-green-600 to-blue-600",
      notes: notes.filter(n => n.scripture).slice(0, 3)
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--scholar-dark)] border-b border-gray-800">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[var(--scholar-gold)]/20 rounded-lg">
              <NotebookPen className="h-6 w-6 text-[var(--scholar-gold)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notes & Journal</h1>
              <p className="text-gray-400 text-sm">Capture your biblical insights and reflections</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(true)}
              className="text-gray-400 hover:text-white hidden md:flex"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
                  onClick={() => setEditingNote(null)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="title"
                    placeholder="Note title"
                    required
                    defaultValue={editingNote?.title || ""}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Input
                    name="scripture"
                    placeholder="Scripture reference (optional)"
                    defaultValue={editingNote?.scripture || ""}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Input
                    name="tags"
                    placeholder="Tags (comma separated)"
                    defaultValue={editingNote?.tags?.join(", ") || ""}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Textarea
                    name="content"
                    placeholder="Your notes..."
                    required
                    rows={8}
                    defaultValue={editingNote?.content || ""}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Button 
                    type="submit" 
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingNote ? "Update Note" : "Create Note"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 md:px-6 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--scholar-darker)] border-gray-600 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[var(--scholar-gold)] text-black" : "text-gray-400"}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[var(--scholar-gold)] text-black" : "text-gray-400"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-8">
        
        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-4 text-center">
                  <div className={`p-3 rounded-lg ${action.color} mx-auto mb-3 w-fit group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1">{action.title}</h3>
                  <p className="text-gray-400 text-xs">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`border-gray-700 hover:border-gray-600 transition-all cursor-pointer ${
                  activeCategory === category.id 
                    ? "bg-[var(--scholar-gold)]/10 border-[var(--scholar-gold)]/30" 
                    : "bg-[var(--scholar-dark)]"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <category.icon className={`h-5 w-5 ${
                      activeCategory === category.id ? "text-[var(--scholar-gold)]" : "text-gray-400"
                    }`} />
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {category.count}
                    </Badge>
                  </div>
                  <p className={`font-medium text-sm ${
                    activeCategory === category.id ? "text-[var(--scholar-gold)]" : "text-white"
                  }`}>
                    {category.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        {featuredContent.map((section, index) => (
          <section key={index}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <section.icon className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                {section.title}
              </h2>
            </div>
            <p className="text-gray-400 mb-4">{section.description}</p>
            
            {section.notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.notes.map((note) => (
                  <Card key={note.id} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-white text-sm group-hover:text-[var(--scholar-gold)] transition-colors line-clamp-1">
                          {note.title}
                        </h3>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingNote(note);
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(note.id)}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {note.scripture && (
                        <Badge variant="outline" className="mb-2 border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)]">
                          {note.scripture}
                        </Badge>
                      )}
                      
                      <p className="text-gray-400 text-xs line-clamp-3 mb-3">
                        {note.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex space-x-2">
                          {note.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="bg-gray-700 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[var(--scholar-dark)] border-gray-700">
                <CardContent className="p-8 text-center">
                  <section.icon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No notes in this category yet</p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-3 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                  >
                    Create Your First Note
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        ))}

        {/* All Notes Grid/List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
              All Notes ({filteredNotes.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-[var(--scholar-dark)] border-gray-700">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                    <Skeleton className="h-3 w-1/2 mb-3 bg-gray-700" />
                    <Skeleton className="h-16 w-full bg-gray-700" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }>
              {filteredNotes.map((note) => (
                <Card key={note.id} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-white group-hover:text-[var(--scholar-gold)] transition-colors line-clamp-1">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingNote(note);
                            setIsDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(note.id)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {note.scripture && (
                      <Badge variant="outline" className="mb-2 border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)]">
                        {note.scripture}
                      </Badge>
                    )}
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                      {note.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex space-x-2">
                        {note.tags?.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="bg-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags && note.tags.length > 2 && (
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[var(--scholar-dark)] border-gray-700">
              <CardContent className="p-12 text-center">
                <NotebookPen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No notes found</h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start capturing your biblical insights"}
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Help Dialog */}
      <PageHelp
        pageName="Notes & Journal"
        helpContent={{
          title: "Notes & Journal Guide",
          description: "Learn how to effectively use the Notes system for your biblical studies",
          features: [
            {
              title: "Create Study Notes",
              description: "Capture insights from your Bible reading and study sessions",
              tips: [
                "Include scripture references to connect notes to specific passages",
                "Use tags to organize notes by topic or theme",
                "Write detailed reflections for future reference"
              ]
            },
            {
              title: "Quick Actions",
              description: "Fast access to common note types",
              tips: [
                "Study Note: For biblical analysis and insights",
                "Daily Journal: For devotional reflections",
                "Sermon Notes: For capturing teaching points",
                "Prayer List: For tracking prayer requests"
              ]
            },
            {
              title: "Organization",
              description: "Keep your notes organized and searchable",
              tips: [
                "Use categories to filter by note type",
                "Search by title, content, or scripture reference",
                "Switch between grid and list views",
                "Tag notes for easy grouping"
              ]
            }
          ]
        }}
      />
    </div>
  );
}