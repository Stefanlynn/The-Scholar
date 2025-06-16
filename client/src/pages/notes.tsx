import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FileText, Edit, Trash2, PenTool } from "lucide-react";
import type { Note } from "@shared/schema";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState("notes");
  const { toast } = useToast();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; scripture?: string; tags?: string[] }) => {
      return apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create note", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Note> }) => {
      return apiRequest("PUT", `/api/notes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note updated successfully" });
      setEditingNote(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update note", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete note", variant: "destructive" });
    },
  });



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      scripture: formData.get("scripture") as string || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredNotes = notes?.filter((note) => {
    const searchLower = searchQuery.toLowerCase();
    const noteContent = typeof note.content === 'string' ? note.content : JSON.stringify(note.content);
    return (
      note.title.toLowerCase().includes(searchLower) ||
      noteContent.toLowerCase().includes(searchLower) ||
      note.scripture?.toLowerCase().includes(searchLower) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  // Organize notes by source type
  const studyToolNotes = filteredNotes?.filter(note => 
    note.tags?.some(tag => 
      ['greek-hebrew', 'cross-references', 'commentary', 'cultural-context', 'study-tool'].includes(tag.toLowerCase())
    )
  );
  
  const manualNotes = filteredNotes?.filter(note => 
    !note.tags?.some(tag => 
      ['greek-hebrew', 'cross-references', 'commentary', 'cultural-context', 'study-tool'].includes(tag.toLowerCase())
    )
  );

  // Journal notes (daily reflections)
  const journalNotes = filteredNotes?.filter(note => 
    note.tags?.some(tag => 
      ['journal', 'reflection', 'prayer', 'daily'].includes(tag.toLowerCase())
    )
  );



  // Render Notes Section with AI Enhancement
  const renderNotesSection = (notesList: Note[] | undefined, title: string, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[var(--scholar-dark)] border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-gray-600" />
                <Skeleton className="h-4 w-1/2 bg-gray-600" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-gray-600" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!notesList || notesList.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchQuery ? "No notes found" : `No ${title.toLowerCase()} yet`}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : emptyMessage}
          </p>
          {!searchQuery && (
            <Button 
              className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notesList.map((note) => (
          <Card key={note.id} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{note.title}</CardTitle>
                  {note.scripture && (
                    <p className="text-[var(--scholar-gold)] text-sm mb-2">{note.scripture}</p>
                  )}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-[var(--scholar-darker)] text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingNote(note);
                      setIsDialogOpen(true);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(note.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm line-clamp-4">
                {typeof note.content === 'string' ? note.content : JSON.stringify(note.content)}
              </p>
              <div className="mt-4 text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render Journal Section
  const renderJournalSection = () => {
    return (
      <div className="space-y-6">
        {/* Quick Journal Entry */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader>
            <CardTitle className="text-[var(--scholar-gold)] flex items-center">
              <PenTool className="h-5 w-5 mr-2" />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Journal Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Daily Journal Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    title: formData.get("title") as string,
                    content: formData.get("content") as string,
                    tags: ["journal", "daily", "reflection"]
                  };
                  createMutation.mutate(data);
                }} className="space-y-4">
                  <Input
                    name="title"
                    placeholder="What's on your heart today?"
                    required
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Textarea
                    name="content"
                    placeholder="Write about what God is showing you, a prayer, or a moment that impacted you..."
                    required
                    rows={8}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                  />
                  <Button 
                    type="submit" 
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                    disabled={createMutation.isPending}
                  >
                    Save Reflection
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        {renderNotesSection(journalNotes, "Journal Entries", "Start recording your daily walk with God")}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Notes</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[var(--scholar-darker)]">
              <TabsTrigger value="notes" className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black">
                <FileText className="h-4 w-4 mr-2" />
                Study Notes
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black">
                <PenTool className="h-4 w-4 mr-2" />
                Daily Journal
              </TabsTrigger>
            </TabsList>

            {/* Study Notes Tab */}
            <TabsContent value="notes" className="mt-6">
              {renderNotesSection(manualNotes, "Personal Study Notes", "Create notes for your biblical studies")}
            </TabsContent>

            {/* Daily Journal Tab */}
            <TabsContent value="journal" className="mt-6">
              {renderJournalSection()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
