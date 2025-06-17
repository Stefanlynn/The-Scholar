import { useState, useRef, useEffect } from "react";

// Web Speech API types for TypeScript
interface VoiceSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: any) => void) | null;
  onend: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onresult: ((event: any) => void) | null;
}
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Save, Plus, Check, RotateCcw, Mic, MicOff, Volume2 } from "lucide-react";
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
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<VoiceSpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
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

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition() as VoiceSpeechRecognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Please try again or check microphone permissions.",
            variant: "destructive",
          });
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          // Trigger send message directly
          sendMessageMutation.mutate(transcript);
        };
        
        recognitionRef.current = recognition;
      }
      
      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle speaking response with voice synthesis
  const speakResponse = (text: string) => {
    if (!synthRef.current || !isVoiceMode) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Clean up text for better speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/`([^`]+)`/g, '$1') // Remove code backticks
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Daniel') || 
      voice.name.includes('Karen') ||
      voice.lang.includes('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  // Stop current speech
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Start voice input
  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }
    
    setMessage(""); // Clear text input
    recognitionRef.current.start();
  };

  // Stop voice input
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    const newVoiceMode = !isVoiceMode;
    setIsVoiceMode(newVoiceMode);
    
    if (!newVoiceMode) {
      // Exiting voice mode - stop any ongoing speech or listening
      stopSpeaking();
      stopListening();
    }
    
    toast({
      title: newVoiceMode ? "Voice Mode Activated" : "Voice Mode Deactivated",
      description: newVoiceMode 
        ? "You can now speak to The Scholar and hear responses" 
        : "Switched back to text mode",
    });
  };

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
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Mode Toggle - Always Visible */}
      <div className="border-b border-gray-800 bg-[var(--scholar-black)] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setScholarMode("study")}
                className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base rounded font-medium transition-all ${
                  scholarMode === "study"
                    ? "bg-[var(--scholar-gold)] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Study Mode
              </button>
              <button
                onClick={() => setScholarMode("devotional")}
                className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base rounded font-medium transition-all ${
                  scholarMode === "devotional"
                    ? "bg-[var(--scholar-gold)] text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Devotional Mode
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <PageHelp pageName="Chat" helpContent={chatHelpContent} />
            {conversation.length > 0 && (
              <Button
                onClick={clearConversation}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm hidden sm:flex"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">New</span>
              </Button>
            )}
            {conversation.length > 0 && (
              <Button
                onClick={clearConversation}
                variant="outline"
                size="sm"
                className="text-xs p-1 sm:hidden"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scroll-smooth px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-4 space-y-3 sm:space-y-4 lg:space-y-5 min-h-0">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading conversation...</div>
        ) : (
          <>
            {/* The Scholar's Welcome Message */}
            {showWelcomeMessage && (
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 sm:space-x-3 max-w-full">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 sm:p-4 flex-1 min-w-0">
                      <div className="text-gray-200 leading-relaxed text-sm sm:text-base">
                        <p className="mb-3 sm:mb-4 lg:mb-5">Grace and peace! I'm The Scholar, your biblical study companion. I'm here to help you dive deeper into God's Word with clarity and theological depth.</p>
                        
                        <div className="space-y-2 sm:space-y-2.5 lg:space-y-3 mb-3 sm:mb-4 lg:mb-5">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm lg:text-base">Scripture interpretation and exegesis</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm lg:text-base">Sermon preparation and teaching outlines</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm lg:text-base">Historical and theological context</span>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-[var(--scholar-gold)] rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm lg:text-base">Cross-references and biblical themes</span>
                          </div>
                        </div>
                        
                        <p className="text-sm sm:text-base lg:text-lg">What passage or topic is the Lord leading you to explore today?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {conversation.map((msg) => (
              <div key={msg.id} className="space-y-3 sm:space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="flex items-start space-x-2 sm:space-x-3 max-w-xs sm:max-w-md lg:max-w-2xl">
                    <div className="gradient-gold text-black rounded-2xl rounded-tr-none p-3 sm:p-4">
                      <p className="text-sm sm:text-base leading-relaxed">{msg.message}</p>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-white w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                {msg.response && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 sm:space-x-3 max-w-full w-full">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 sm:p-4 flex-1 min-w-0">
                        <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm sm:text-base">{msg.response}</p>
                        
                        <div className="mt-3 flex">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveAction(msg.id, "Save to Notes")}
                            className="bg-[var(--scholar-darker)] text-[var(--scholar-gold)] hover:bg-gray-800 text-xs sm:text-sm px-3 py-1.5"
                          >
                            {savedButtons.has(msg.id) ? (
                              <>
                                <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Saved!</span>
                                <span className="sm:hidden">✓</span>
                              </>
                            ) : (
                              <>
                                <Save className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Save to Notes</span>
                                <span className="sm:hidden">Save</span>
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
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={scholarLogo} alt="The Scholar" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-3 sm:p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--scholar-gold)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm">The Scholar is thinking...</span>
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
      <div className="bg-[var(--scholar-black)] px-3 sm:px-4 lg:px-6 pb-20 sm:pb-6 flex-shrink-0 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask The Scholar about Scripture..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[var(--scholar-darker)] border-2 border-gray-600 text-white px-3 sm:px-4 lg:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-lg focus:outline-none focus:border-[var(--scholar-gold)] resize-none min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem] max-h-32 text-sm sm:text-base lg:text-lg"
                rows={1}
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 p-2 sm:p-2.5 lg:p-3 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}