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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MessageSquare, Edit, Trash2, Calendar } from "lucide-react";
import type { Sermon } from "@shared/schema";

export default function SermonPrep() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const { toast } = useToast();

  const { data: sermons, isLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; scripture: string; outline: string; notes?: string }) => {
      return apiRequest("POST", "/api/sermons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      toast({ title: "Sermon created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create sermon", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Sermon> }) => {
      return apiRequest("PUT", `/api/sermons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      toast({ title: "Sermon updated successfully" });
      setEditingSermon(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update sermon", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/sermons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      toast({ title: "Sermon deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete sermon", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      scripture: formData.get("scripture") as string,
      outline: formData.get("outline") as string,
      notes: formData.get("notes") as string || undefined,
    };

    if (editingSermon) {
      updateMutation.mutate({ id: editingSermon.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredSermons = sermons?.filter((sermon) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      sermon.title.toLowerCase().includes(searchLower) ||
      sermon.scripture.toLowerCase().includes(searchLower) ||
      sermon.outline.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Sermon Prep</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search sermons..."
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
                    onClick={() => setEditingSermon(null)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Sermon
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSermon ? "Edit Sermon" : "Create New Sermon"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="title"
                      placeholder="Sermon title"
                      required
                      defaultValue={editingSermon?.title || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Input
                      name="scripture"
                      placeholder="Scripture reference"
                      required
                      defaultValue={editingSermon?.scripture || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Textarea
                      name="outline"
                      placeholder="Sermon outline"
                      required
                      rows={8}
                      defaultValue={editingSermon?.outline || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Textarea
                      name="notes"
                      placeholder="Additional notes (optional)"
                      rows={4}
                      defaultValue={editingSermon?.notes || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingSermon ? "Update Sermon" : "Create Sermon"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-[var(--scholar-dark)] border-gray-700">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-gray-600" />
                    <Skeleton className="h-4 w-1/2 bg-gray-600" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full bg-gray-600" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSermons?.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? "No sermons found" : "No sermons prepared yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Start preparing your first sermon"}
              </p>
              {!searchQuery && (
                <Button 
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Sermon
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSermons?.map((sermon) => (
                <Card key={sermon.id} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{sermon.title}</CardTitle>
                        <p className="text-[var(--scholar-gold)] text-sm mb-2">{sermon.scripture}</p>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(sermon.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingSermon(sermon);
                            setIsDialogOpen(true);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(sermon.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium text-sm mb-1">Outline:</h4>
                        <p className="text-gray-300 text-sm line-clamp-4 whitespace-pre-line">
                          {sermon.outline}
                        </p>
                      </div>
                      {sermon.notes && (
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">Notes:</h4>
                          <p className="text-gray-300 text-sm line-clamp-2 whitespace-pre-line">
                            {sermon.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
