import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Save, Plus, Check } from "lucide-react";
import type { ChatMessage } from "@shared/schema";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [savedButtons, setSavedButtons] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load initial messages from server
  const { data: serverMessages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    enabled: !!user,
  });

  // Update conversation when server messages load
  useEffect(() => {
    if (serverMessages) {
      setConversation(serverMessages);
    }
  }, [serverMessages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      // Add user message to conversation immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        message: messageText,
        userId: user?.id || "demo-user",
        response: null,
        timestamp: new Date() as any
      };
      
      setConversation(prev => [...prev, userMessage]);
      setIsThinking(true);
      
      // Send to API
      const response = await apiRequest("POST", "/api/chat/messages", { message: messageText });
      return response.json();
    },
    onSuccess: (data) => {
      // Replace the user message with the complete message including AI response
      setConversation(prev => {
        const newConv = [...prev];
        const lastIndex = newConv.length - 1;
        if (lastIndex >= 0) {
          newConv[lastIndex] = {
            ...data,
            timestamp: new Date(data.timestamp)
          };
        }
        return newConv;
      });
      setIsThinking(false);
      setMessage("");
      adjustTextareaHeight();
    },
    onError: () => {
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

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !sendMessageMutation.isPending) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading conversation...</div>
        ) : conversation.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-white mb-2">Start a conversation with The Scholar</h3>
              <p>Ask questions about Scripture, seek biblical insights, or explore theological topics.</p>
            </div>
          </div>
        ) : (
          <>
            {conversation.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="flex items-start space-x-3 max-w-xs md:max-w-2xl">
                    <div className="gradient-gold text-black rounded-2xl rounded-tr-none p-3 md:p-4">
                      <p className="text-sm md:text-base">{msg.message}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-white text-sm md:text-base" />
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                {msg.response && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-xs md:max-w-2xl">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 md:p-4">
                        <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base">{msg.response}</p>
                        
                        <div className="mt-3 md:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveAction(msg.id, "Save to Notes")}
                            className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)] hover:bg-gray-800 text-xs"
                          >
                            {savedButtons.has(msg.id) ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Saved!
                              </>
                            ) : (
                              <>
                                <Save className="mr-1 h-3 w-3" />
                                Save to Notes
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveAction(msg.id + 1000, "Add to Sermon")}
                            className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)] hover:bg-gray-800 text-xs"
                          >
                            {savedButtons.has(msg.id + 1000) ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Added!
                              </>
                            ) : (
                              <>
                                <Plus className="mr-1 h-3 w-3" />
                                Add to Sermon
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
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
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-800 bg-[var(--scholar-black)] p-4 pb-20 md:pb-4">
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
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="absolute bottom-3 right-3 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 p-2 h-8 w-8 rounded-full"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}