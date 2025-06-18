import { useState, useRef, useEffect } from "react";

// Web Speech API types for TypeScript
interface VoiceSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
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
import { Send, User, Save, Plus, Check, RotateCcw, Mic, MicOff, Volume2, Pause, Square, Play, Trash2 } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordedTranscript, setRecordedTranscript] = useState("");
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMessage, setIsVoiceMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<VoiceSpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentTranscriptRef = useRef<string>("");
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
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        // Set max alternatives if supported
        if ('maxAlternatives' in recognition) {
          (recognition as any).maxAlternatives = 3;
        }
        
        recognition.onstart = () => {
          setIsRecording(true);
          setShowRecordingControls(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          // Show controls if we have any transcript
          setTimeout(() => {
            if (currentTranscriptRef.current.trim()) {
              setShowRecordingControls(true);
            }
          }, 100);
        };
        
        recognition.onerror = (event: any) => {
          setIsRecording(false);
          setShowRecordingControls(false);
          setRecordedTranscript("");
          toast({
            title: "Voice Recognition Error",
            description: "Please try again or check microphone permissions.",
            variant: "destructive",
          });
        };
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            // Get the most confident alternative
            let bestTranscript = event.results[i][0].transcript;
            let bestConfidence = event.results[i][0].confidence || 0;
            
            // Check other alternatives for higher confidence
            for (let j = 1; j < event.results[i].length; j++) {
              const altConfidence = event.results[i][j].confidence || 0;
              if (altConfidence > bestConfidence) {
                bestTranscript = event.results[i][j].transcript;
                bestConfidence = altConfidence;
              }
            }
            
            if (event.results[i].isFinal) {
              finalTranscript += bestTranscript;
            } else {
              interimTranscript += bestTranscript;
            }
          }
          
          if (finalTranscript.trim()) {
            setRecordedTranscript(finalTranscript.trim());
            currentTranscriptRef.current = finalTranscript.trim();
            // Auto-stop recording when we get final result
            setTimeout(() => recognition.stop(), 500);
          } else if (interimTranscript.trim()) {
            // Show interim results while speaking
            setRecordedTranscript(interimTranscript.trim());
            currentTranscriptRef.current = interimTranscript.trim();
          }
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
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Clean up text for better speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/`([^`]+)`/g, '$1') // Remove code backticks
      .replace(/•/g, '') // Remove bullet points
      .replace(/\n+/g, '. ') // Replace line breaks with pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\.+/g, '.') // Fix multiple periods
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.85; // Slightly slower for scholarly pace
    utterance.pitch = 0.8; // Lower pitch for more masculine, authoritative sound
    utterance.volume = 0.9;
    
    // Try to use a scholarly male voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      // Look for masculine, scholarly voices first
      voice.name.includes('Daniel') ||
      voice.name.includes('David') ||
      voice.name.includes('Alex') ||
      voice.name.includes('Thomas') ||
      voice.name.includes('James') ||
      voice.name.includes('Michael') ||
      voice.name.includes('Male') ||
      // Fallback to any English male voice
      (voice.lang.includes('en') && voice.name.toLowerCase().includes('male'))
    ) || voices.find(voice => 
      // If no specific male voice found, look for deeper/authoritative voices
      voice.name.includes('Arthur') ||
      voice.name.includes('Bruce') ||
      voice.name.includes('Fred') ||
      voice.lang.includes('en-GB') // British voices often sound more scholarly
    ) || voices.find(voice => voice.lang.includes('en')); // Final fallback
    
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

  // Start recording voice input
  const startRecording = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
      return;
    }
    
    // Check microphone permission and quality
    try {
      await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access. Try speaking closer to your device in a quiet environment.",
        variant: "destructive",
      });
      return;
    }
    
    // Reset all voice states
    setRecordedTranscript("");
    currentTranscriptRef.current = "";
    setShowRecordingControls(false);
    setIsRecording(false);
    
    // Ensure previous recognition is stopped
    try {
      recognitionRef.current.abort();
    } catch (e) {
      // Ignore errors if recognition wasn't running
    }
    
    // Start new recognition after a brief delay
    setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          toast({
            title: "Speech Recognition Error",
            description: "Please try again. Ensure you're in a quiet environment and speak clearly.",
            variant: "destructive",
          });
        }
      }
    }, 100);
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        // Manually trigger the same flow as automatic stop
        setIsRecording(false);
        setTimeout(() => {
          if (currentTranscriptRef.current.trim()) {
            setShowRecordingControls(true);
          }
        }, 100);
      } catch (e) {
        // If stop fails, try abort
        try {
          recognitionRef.current.abort();
          setIsRecording(false);
          setTimeout(() => {
            if (currentTranscriptRef.current.trim()) {
              setShowRecordingControls(true);
            }
          }, 100);
        } catch (abortError) {
          // Force reset states if both fail
          setIsRecording(false);
          setShowRecordingControls(false);
        }
      }
    }
  };

  // Play back recorded audio (simulate with text-to-speech)
  const playRecording = () => {
    if (recordedTranscript && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(recordedTranscript);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  // Send recorded message
  const sendRecording = () => {
    if (recordedTranscript.trim()) {
      setMessage(recordedTranscript);
      setIsVoiceMessage(true); // Mark this as a voice message
      sendMessageMutation.mutate(recordedTranscript);
      setShowRecordingControls(false);
      setRecordedTranscript("");
      currentTranscriptRef.current = "";
      setIsRecording(false);
      // Reset speech recognition state
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    }
  };

  // Delete recording
  const deleteRecording = () => {
    setRecordedTranscript("");
    currentTranscriptRef.current = "";
    setShowRecordingControls(false);
    setIsRecording(false);
    // Reset speech recognition state
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
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
      
      // Always speak the response when it comes from voice input
      if (data.response && isVoiceMessage) {
        speakResponse(data.response);
        setIsVoiceMessage(false); // Reset voice message flag
      }
      
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
    <div className="fixed inset-0 flex flex-col bg-[var(--scholar-black)] overflow-hidden">
      {/* Mode Toggle - Always Visible */}
      <div className="border-b border-gray-800/50 bg-[var(--scholar-black)] px-3 sm:px-4 lg:px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative inline-flex items-center bg-gray-900/60 rounded-full p-1 backdrop-blur-sm border border-gray-700/30">
              <button
                onClick={() => setScholarMode("study")}
                className={`relative px-3 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                  scholarMode === "study"
                    ? "bg-[var(--scholar-gold)] text-black shadow-lg shadow-yellow-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Study Mode
              </button>
              <button
                onClick={() => setScholarMode("devotional")}
                className={`relative px-3 py-2 text-xs font-medium rounded-full transition-all duration-300 ${
                  scholarMode === "devotional"
                    ? "bg-[var(--scholar-gold)] text-black shadow-lg shadow-yellow-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
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
      <div className="flex-1 overflow-y-auto scroll-smooth px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-32 sm:pb-24 space-y-3 sm:space-y-4 lg:space-y-5">
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

      {/* Recording Visual Indicator */}
      {isRecording && (
        <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 to-purple-900/20 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />
          <div className="text-center relative z-60">
            <div className="w-32 h-32 rounded-full bg-red-500/20 animate-pulse flex items-center justify-center mx-auto">
              <div className="w-20 h-20 rounded-full bg-red-500/40 animate-ping flex items-center justify-center">
                <Mic className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <p className="text-red-500 font-medium mt-4">Recording...</p>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto text-center">
              Speak clearly and close to your device. Pause briefly between sentences.
            </p>
            
            {/* Live transcript preview */}
            {recordedTranscript && (
              <div className="mt-4 bg-black/50 rounded-lg p-3 max-w-md mx-auto">
                <p className="text-white text-sm">{recordedTranscript}</p>
              </div>
            )}
            
            {/* Manual stop button */}
            <Button
              onClick={stopRecording}
              className="mt-6 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-6 py-3 relative cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              style={{ zIndex: 9999, position: 'relative' }}
            >
              <MicOff className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
            
            <div className="flex justify-center mt-4 space-x-2">
              {/* Simulated waveform */}
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '20px', animationDelay: '0s'}}></div>
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '35px', animationDelay: '0.1s'}}></div>
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '15px', animationDelay: '0.2s'}}></div>
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '40px', animationDelay: '0.3s'}}></div>
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '25px', animationDelay: '0.4s'}}></div>
              <div className="w-1 bg-red-500 animate-pulse" style={{height: '30px', animationDelay: '0.5s'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {showRecordingControls && recordedTranscript && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
          <div className="bg-[var(--scholar-dark)] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Voice Message</h3>
            <div className="bg-[var(--scholar-darker)] rounded-lg p-3 mb-4">
              <p className="text-gray-300 text-sm">{recordedTranscript}</p>
            </div>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={playRecording}
                variant="outline"
                className="border-[var(--scholar-gold)] text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)] hover:text-black px-4 py-2"
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Listen
              </Button>
              <Button
                onClick={sendRecording}
                className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 px-4 py-2"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
              <Button
                onClick={deleteRecording}
                variant="destructive"
                className="px-4 py-2"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="fixed bottom-32 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black px-6 py-4 rounded-2xl flex items-center space-x-4 shadow-2xl backdrop-blur-sm border border-yellow-300/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <div className="absolute -inset-1 bg-black/10 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-semibold tracking-wide">The Scholar is speaking...</span>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => {
                  if (synthRef.current) {
                    synthRef.current.pause();
                  }
                }}
                className="group relative w-9 h-9 bg-black/10 hover:bg-black/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                title="Pause"
              >
                <div className="text-lg leading-none">⏸</div>
                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-black/20 transition-all duration-200"></div>
              </button>
              
              <button
                onClick={stopSpeaking}
                className="group relative w-9 h-9 bg-black/10 hover:bg-black/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                title="Stop"
              >
                <div className="text-lg leading-none font-bold">×</div>
                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-black/20 transition-all duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-[var(--scholar-black)] px-3 sm:px-4 lg:px-6 pb-20 sm:pb-6 flex-shrink-0 border-t border-gray-800 fixed bottom-0 left-0 right-0 z-30">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask The Scholar about Scripture..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[var(--scholar-darker)] border-2 border-gray-600 text-white px-3 sm:px-4 lg:px-5 py-3 sm:py-4 pr-20 sm:pr-24 rounded-lg focus:outline-none focus:border-[var(--scholar-gold)] resize-none min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem] max-h-32 text-sm sm:text-base lg:text-lg"
                rows={1}
                disabled={sendMessageMutation.isPending}
              />
              
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={sendMessageMutation.isPending}
                className={`absolute bottom-3 sm:bottom-4 right-12 sm:right-14 h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                  isRecording 
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-red-500/30" 
                    : "bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:shadow-yellow-500/40"
                } backdrop-blur-sm border border-white/10`}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5 mx-auto" />
                ) : (
                  <Mic className="h-5 w-5 mx-auto" />
                )}
              </button>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 h-10 w-10 sm:h-11 sm:w-11 rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/10 ${
                  !message.trim() || sendMessageMutation.isPending
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:scale-105 active:scale-95 hover:shadow-yellow-500/40"
                }`}
              >
                <Send className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}