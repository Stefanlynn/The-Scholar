import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Save, Plus, Check, RotateCcw } from "lucide-react";
import type { ChatMessage } from "@shared/schema";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [savedButtons, setSavedButtons] = useState<Set<number>>(new Set());
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [scholarMode, setScholarMode] = useState<"study" | "devotional">("study");
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
      // Show welcome message when there are no messages, hide when there are messages
      setShowWelcomeMessage(serverMessages.length === 0);
    }
  }, [serverMessages]);

  // Also update welcome message visibility when conversation changes
  useEffect(() => {
    setShowWelcomeMessage(conversation.length === 0);
  }, [conversation.length]);

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
      const response = await apiRequest("POST", "/api/chat/messages", { 
        message: messageText,
        mode: scholarMode 
      });
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
      // Update profile stats for chat activity
      queryClient.invalidateQueries({ queryKey: ["/api/profile/stats"] });
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

  const saveToNotesMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/notes", noteData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Saved to Notes successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to save to Notes", variant: "destructive" });
    },
  });

  const handleSaveAction = (messageId: number, action: string) => {
    // Find the message to save
    const messageToSave = conversation.find(msg => msg.id === messageId);
    if (!messageToSave || !messageToSave.response) {
      toast({ title: "No response to save", variant: "destructive" });
      return;
    }

    setSavedButtons(prev => new Set(prev).add(messageId));
    
    // Create note from The Scholar's response
    const noteTitle = `Scholar Response: ${messageToSave.message.slice(0, 50)}${messageToSave.message.length > 50 ? '...' : ''}`;
    const noteContent = `Question: ${messageToSave.message}\n\nThe Scholar's Response:\n${messageToSave.response}`;
    
    saveToNotesMutation.mutate({
      title: noteTitle,
      content: noteContent
    });
    
    setTimeout(() => {
      setSavedButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 2000);
  };

  const clearConversation = () => {
    setConversation([]);
    setShowWelcomeMessage(true);
    // Optionally invalidate the chat messages query to refresh from server
    queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with New Conversation Button */}
      {conversation.length > 0 && (
        <div className="border-b border-gray-800 bg-[var(--scholar-black)] px-4 py-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-300">Conversation with The Scholar</h2>
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              New Conversation
            </Button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading conversation...</div>
        ) : (
          <>
            {/* The Scholar's Welcome Message - shows for 5 minutes or until manually dismissed */}
            {showWelcomeMessage && (
              <div className="space-y-6">
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-xs md:max-w-2xl">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-4 md:p-6">
                      <div className="text-gray-200 leading-relaxed text-sm md:text-base">
                        <p className="mb-4">Grace and peace! I'm The Scholar, your Spirit-led biblical study companion. I'm here to help you dive deeper into God's Word with clarity and theological depth. I can assist you with:</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full"></div>
                            <span>Scripture interpretation and exegesis</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full"></div>
                            <span>Sermon preparation and teaching outlines</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full"></div>
                            <span>Historical and theological context</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full"></div>
                            <span>Cross-references and biblical themes</span>
                          </div>
                        </div>
                        
                        <p>What passage or topic is the Lord leading you to explore today?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
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
                        
                        <div className="mt-3 md:mt-4 flex">
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
      
      {/* Mode Toggle */}
      <div className="border-t border-gray-800 bg-[var(--scholar-black)] px-4 pt-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setScholarMode("study")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              scholarMode === "study"
                ? "bg-[var(--scholar-gold)] text-[var(--scholar-black)]"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Study Mode
          </button>
          <button
            type="button"
            onClick={() => setScholarMode("devotional")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              scholarMode === "devotional"
                ? "bg-[var(--scholar-gold)] text-[var(--scholar-black)]"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Devotional Mode
          </button>
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-[var(--scholar-black)] px-4 pb-20 md:pb-4">
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