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
import PageHelp from "@/components/page-help";

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

  const chatHelpContent = {
    title: "How to Use The Scholar Chat",
    description: "The Scholar is your AI-powered biblical study assistant. Choose between Study Mode for academic analysis or Devotional Mode for heart-level encouragement, then ask questions about Scripture, theology, or spiritual topics.",
    features: [
      {
        title: "Study Mode vs Devotional Mode",
        description: "Switch between two distinct conversation styles using the toggle buttons above the chat input.",
        tips: [
          "Study Mode: Get scholarly insights, Greek/Hebrew analysis, cross-references, and sermon preparation help",
          "Devotional Mode: Receive warm encouragement, personal application, and spiritual reflection",
          "The Scholar adapts its personality completely based on your selected mode"
        ]
      },
      {
        title: "Expert Voice Adaptation",
        description: "The Scholar automatically adjusts its teaching style based on your question topic, channeling different biblical experts.",
        tips: [
          "Theology questions get responses like Dr. Frank Turek or John Piper",
          "Leadership topics channel John Maxwell or Andy Stanley",
          "Prophetic insights use Kris Vallotton's style",
          "Inner healing follows Bob Hamp's compassionate approach"
        ]
      },
      {
        title: "Asking Questions",
        description: "Type any biblical, theological, or spiritual question in the chat box and press Enter or click Send.",
        tips: [
          "Ask about specific verses: 'What does John 3:16 mean?'",
          "Request word studies: 'What does agape mean in Greek?'",
          "Seek sermon help: 'Give me an outline for Romans 8:28'",
          "Personal spiritual questions: 'How do I hear God's voice?'"
        ]
      },
      {
        title: "Save Responses to Notes",
        description: "Click 'Save to Notes' below any Scholar response to save it to your personal Notes section.",
        tips: [
          "Saved responses include both your question and The Scholar's answer",
          "Notes are automatically titled with the first part of your question",
          "Access all saved content in the Notes section"
        ]
      },
      {
        title: "Managing Conversations",
        description: "Use conversation controls to manage your chat history and start fresh topics.",
        tips: [
          "Click 'New Conversation' to clear the current chat and start fresh",
          "Your conversation history is automatically saved",
          "The Scholar remembers context within each conversation"
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col h-full pb-20 md:pb-0">
      {/* Mode Toggle - Always Visible */}
      <div className="border-b border-gray-800 bg-[var(--scholar-black)] px-4 py-3 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setScholarMode("study")}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-all ${
                  scholarMode === "study"
                    ? "bg-[var(--scholar-gold)] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Study Mode
              </button>
              <button
                onClick={() => setScholarMode("devotional")}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-all ${
                  scholarMode === "devotional"
                    ? "bg-[var(--scholar-gold)] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Devotional Mode
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <PageHelp pageName="Chat" helpContent={chatHelpContent} />
            {conversation.length > 0 && (
              <Button
                onClick={clearConversation}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                New
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pt-16 md:pt-12 pb-4 space-y-4 md:space-y-6">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading conversation...</div>
        ) : (
          <>
            {/* The Scholar's Welcome Message */}
            {showWelcomeMessage && (
              <div className="space-y-4 md:space-y-6 mb-4">
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 md:space-x-3 max-w-full">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 md:p-6 flex-1 min-w-0">
                      <div className="text-gray-200 leading-relaxed text-sm md:text-base">
                        <p className="mb-3 md:mb-4">Grace and peace! I'm The Scholar, your Spirit-led biblical study companion. I'm here to help you dive deeper into God's Word with clarity and theological depth.</p>
                        
                        <div className="space-y-2 mb-3 md:mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs md:text-sm">Scripture interpretation and exegesis</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs md:text-sm">Sermon preparation and teaching outlines</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs md:text-sm">Historical and theological context</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs md:text-sm">Cross-references and biblical themes</span>
                          </div>
                        </div>
                        
                        <p className="text-sm md:text-base">What passage or topic is the Lord leading you to explore today?</p>
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