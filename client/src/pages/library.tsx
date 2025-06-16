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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, BookOpen, Edit, Trash2 } from "lucide-react";
import type { LibraryItem } from "@shared/schema";

const categories = ["Commentary", "Theology", "History", "Reference", "Devotional", "Sermon", "Study Guide"];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const { toast } = useToast();

  const { data: libraryItems, isLoading } = useQuery<LibraryItem[]>({
    queryKey: ["/api/library"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; author: string; content: string; category: string }) => {
      return apiRequest("POST", "/api/library", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
      toast({ title: "Library item created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create library item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<LibraryItem> }) => {
      return apiRequest("PUT", `/api/library/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
      toast({ title: "Library item updated successfully" });
      setEditingItem(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update library item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/library/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
      toast({ title: "Library item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete library item", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredItems = libraryItems?.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Library</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-[var(--scholar-darker)] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
                    onClick={() => setEditingItem(null)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Library Item" : "Add Library Item"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="title"
                      placeholder="Title"
                      required
                      defaultValue={editingItem?.title || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Input
                      name="author"
                      placeholder="Author"
                      defaultValue={editingItem?.author || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Select name="category" defaultValue={editingItem?.category || categories[0]}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      name="content"
                      placeholder="Content"
                      required
                      rows={6}
                      defaultValue={editingItem?.content || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
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
          ) : filteredItems?.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? "No items found" : "No library items yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Start building your theological library"}
              </p>
              {!searchQuery && (
                <Button 
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems?.map((item) => (
                <Card key={item.id} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{item.title}</CardTitle>
                        {item.author && (
                          <p className="text-gray-400 text-sm mb-2">by {item.author}</p>
                        )}
                        <Badge variant="secondary" className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)]">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingItem(item);
                            setIsDialogOpen(true);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {item.content}
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
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
