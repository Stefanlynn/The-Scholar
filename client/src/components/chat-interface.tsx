import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { makeAuthenticatedRequest } from "@/lib/authUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip, Mic, Book, GraduationCap, User, Save, Plus, Check } from "lucide-react";
import type { ChatMessage } from "@shared/schema";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";



export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [savedButtons, setSavedButtons] = useState<Set<number>>(new Set());
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: serverMessages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    enabled: !!user,
  });

  // Combine server messages with local messages
  const messages = [...(serverMessages || []), ...localMessages];

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      // Add user message immediately to local state
      const userMessage: ChatMessage = {
        id: Date.now(), // temporary ID
        message: messageText,
        userId: user?.id || "demo-user",
        response: null,
        timestamp: new Date().toISOString() as any
      };
      setLocalMessages(prev => [...prev, userMessage]);
      setIsThinking(true);
      
      // Send to API
      const response = await apiRequest("POST", "/api/chat/messages", { message: messageText });
      return response.json();
    },
    onSuccess: (data) => {
      // Remove the temporary user message and thinking state
      setLocalMessages([]);
      setIsThinking(false);
      // Refresh server messages to get the complete conversation
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
      adjustTextareaHeight();
    },
    onError: () => {
      setLocalMessages([]);
      setIsThinking(false);
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change or thinking state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };



  const handleSaveAction = (messageId: number, action: string) => {
    setSavedButtons(prev => new Set(prev).add(messageId));
    toast({ title: `${action} successful!` });
    
    setTimeout(() => {
      setSavedButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
        {/* Welcome Message */}
        <div className="scholar-chat-bubble">
          <div className="flex items-start space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--scholar-gold)] rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-black text-sm md:text-base" />
            </div>
            <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 md:p-4 max-w-xs md:max-w-2xl">
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">Grace and peace! I'm The Scholar, your Spirit-led biblical study companion. I'm here to help you dive deeper into God's Word with clarity and theological depth. I can assist you with:</p>
              <ul className="mt-3 space-y-2 text-xs md:text-sm text-gray-300">
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-3 w-3 md:h-4 md:w-4" />Scripture interpretation and exegesis</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-3 w-3 md:h-4 md:w-4" />Sermon preparation and teaching outlines</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-3 w-3 md:h-4 md:w-4" />Historical and theological context</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-3 w-3 md:h-4 md:w-4" />Cross-references and biblical themes</li>
              </ul>
              <p className="mt-3 text-gray-400 text-xs md:text-sm">What passage or topic is the Lord leading you to explore today?</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          messages?.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {/* User Message */}
              <div className="scholar-chat-bubble">
                <div className="flex items-start space-x-3 md:space-x-4 justify-end">
                  <div className="gradient-gold text-black rounded-2xl rounded-tr-none p-3 md:p-4 max-w-xs md:max-w-2xl">
                    <p className="text-sm md:text-base">{msg.message}</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-white text-sm md:text-base" />
                  </div>
                </div>
              </div>

              {/* AI Response */}
              {msg.response && (
                <div className="scholar-chat-bubble">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 md:p-4 max-w-xs md:max-w-2xl">
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base">{msg.response}</p>
                      
                      <div className="mt-3 md:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveAction(msg.id, "Save to Notes")}
                          className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)] hover:bg-gray-800 text-xs w-full sm:w-auto"
                        >
                          {savedButtons.has(msg.id) ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="mr-1 h-3 w-3" />
                              <span className="hidden sm:inline">Save to Notes</span>
                              <span className="sm:hidden">Save</span>
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveAction(msg.id, "Add to Sermon")}
                          className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)] hover:bg-gray-800 text-xs w-full sm:w-auto"
                        >
                          {savedButtons.has(msg.id + 1000) ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Added!
                            </>
                          ) : (
                            <>
                              <Plus className="mr-1 h-3 w-3" />
                              <span className="hidden sm:inline">Add to Sermon</span>
                              <span className="sm:hidden">Add</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Thinking indicator when The Scholar is responding */}
        {isThinking && (
          <div className="scholar-chat-bubble">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 md:p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-400 text-sm">The Scholar is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input Box - Always Visible, with mobile spacing */}
      <div className="border-t border-gray-800 bg-[var(--scholar-black)] p-4 pb-20 md:pb-4 flex-shrink-0" style={{ minHeight: '100px' }}>
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask The Scholar about Scripture..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[var(--scholar-darker)] border-2 border-gray-600 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[var(--scholar-gold)] resize-none min-h-[3rem] max-h-32 text-base"
                rows={1}
                style={{ backgroundColor: '#0a0a0a', color: 'white' }}
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="absolute bottom-3 right-3 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 p-2 h-8 w-8 rounded-full"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-400">
                <button type="button" className="hover:text-white transition-colors flex items-center">
                  <Paperclip className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Attach</span>
                </button>
                <button type="button" className="hover:text-white transition-colors flex items-center">
                  <Mic className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Voice</span>
                </button>
                <button type="button" className="hover:text-white transition-colors flex items-center">
                  <Book className="mr-1 h-3 w-3" />
                  <span className="hidden md:inline">Quote Scripture</span>
                  <span className="md:hidden sm:inline">Quote</span>
                </button>
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                Press Ctrl+Enter to send
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
