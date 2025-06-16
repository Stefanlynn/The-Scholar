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
import { Plus, Search, FileText, Edit, Trash2, Sparkles, Share2, Download, Copy, Mail, BookOpen, Heart, Lightbulb, Zap, MessageSquare } from "lucide-react";
import type { Note } from "@shared/schema";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [enhancingNoteId, setEnhancingNoteId] = useState<number | null>(null);
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

  // AI Enhancement mutation
  const aiEnhanceMutation = useMutation({
    mutationFn: async ({ noteId, enhancementType, content }: { noteId: number; enhancementType: string; content: string }) => {
      const response = await apiRequest("POST", "/api/chat/send", {
        message: `${enhancementType}: ${content}`,
        context: "note-enhancement"
      });
      return response.response;
    },
    onSuccess: (enhancedContent, variables) => {
      // Update the note with enhanced content
      updateMutation.mutate({ 
        id: variables.noteId, 
        data: { content: enhancedContent } 
      });
      setAiEnhancing(false);
      setEnhancingNoteId(null);
      toast({ title: "Note enhanced successfully!" });
    },
    onError: () => {
      setAiEnhancing(false);
      setEnhancingNoteId(null);
      toast({ title: "Failed to enhance note", variant: "destructive" });
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
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
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

  // AI Enhancement Functions
  const handleAiEnhancement = (noteId: number, enhancementType: string, content: string) => {
    setEnhancingNoteId(noteId);
    setAiEnhancing(true);
    
    let prompt = "";
    switch (enhancementType) {
      case 'expand':
        prompt = `Expand this note into a full paragraph with more detail and insight: "${content}"`;
        break;
      case 'scripture':
        prompt = `Add a relevant Scripture verse that supports this thought: "${content}"`;
        break;
      case 'illustration':
        prompt = `Suggest a clear illustration or example for this idea: "${content}"`;
        break;
      case 'summarize':
        prompt = `Summarize this into a clear takeaway statement: "${content}"`;
        break;
      case 'clarify':
        prompt = `Give me a clearer way to express this thought: "${content}"`;
        break;
      default:
        prompt = content;
    }
    
    aiEnhanceMutation.mutate({ noteId, enhancementType: prompt, content });
  };

  // Sharing Functions
  const handleShare = (note: Note, shareType: string) => {
    switch (shareType) {
      case 'copy':
        navigator.clipboard.writeText(`${note.title}\n\n${note.content}\n\n${note.scripture ? `Scripture: ${note.scripture}` : ''}`);
        toast({ title: "Note copied to clipboard" });
        break;
      case 'pdf':
        // Implementation would require a PDF library
        toast({ title: "PDF export feature coming soon" });
        break;
      case 'email':
        const subject = encodeURIComponent(`Study Note: ${note.title}`);
        const body = encodeURIComponent(`${note.content}\n\n${note.scripture ? `Scripture: ${note.scripture}` : ''}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        break;
      default:
        break;
    }
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
            <TabsList className="grid w-full grid-cols-3 bg-[var(--scholar-darker)]">
              <TabsTrigger value="notes" className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black">
                <FileText className="h-4 w-4 mr-2" />
                Study Notes
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black">
                <Heart className="h-4 w-4 mr-2" />
                Daily Journal
              </TabsTrigger>
              <TabsTrigger value="scholar" className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black">
                <Sparkles className="h-4 w-4 mr-2" />
                Scholar Insights
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

            {/* Scholar Insights Tab */}
            <TabsContent value="scholar" className="mt-6">
              {renderNotesSection(studyToolNotes, "Saved from Study Tools", "Use study tools in the Bible section to create AI-enhanced notes")}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
