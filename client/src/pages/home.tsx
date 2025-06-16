import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import QuickAccess from "@/components/quick-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, User, Send, GraduationCap } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return apiRequest("POST", "/api/chat/messages", { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">The Scholar</h2>
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium px-4 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Message */}
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-[var(--scholar-gold)] rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-black" />
            </div>
            <div className="bg-[var(--scholar-dark)] rounded-lg p-4 max-w-2xl">
              <p className="text-gray-200">Grace and peace! I'm The Scholar, your Spirit-led biblical study companion. I'm here to help you dive deeper into God's Word with clarity and theological depth.</p>
              <p className="mt-2 text-gray-400 text-sm">What passage or topic is the Lord leading you to explore today?</p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages?.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-4 justify-end">
                <div className="bg-[var(--scholar-gold)] text-black rounded-lg p-4 max-w-2xl">
                  <p>{msg.message}</p>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-white" />
                </div>
              </div>

              {/* AI Response */}
              {msg.response && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[var(--scholar-gold)] rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-black" />
                  </div>
                  <div className="bg-[var(--scholar-dark)] rounded-lg p-4 max-w-2xl">
                    <p className="text-gray-200 whitespace-pre-line">{msg.response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input - Fixed at bottom */}
        <div className="border-t border-gray-800 bg-[var(--scholar-black)] p-6 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  placeholder="Ask The Scholar about Scripture..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[var(--scholar-darker)] border border-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[var(--scholar-gold)] resize-none min-h-[3rem] max-h-32"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="absolute bottom-3 right-3 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 p-2 h-8 w-8"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <QuickAccess />
      <MobileTabBar />
    </div>
  );
}
