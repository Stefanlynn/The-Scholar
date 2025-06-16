import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip, Mic, Book, GraduationCap, User, Save, Plus, Check } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

const suggestedQuestions = [
  "What are the historical farming practices in Jesus' time?",
  "How can I apply this to modern congregation?",
  "Show me cross-references to similar parables",
  "Create a sermon outline for this passage"
];

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [savedButtons, setSavedButtons] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      adjustTextareaHeight();
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

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

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    textareaRef.current?.focus();
    adjustTextareaHeight();
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Message */}
        <div className="scholar-chat-bubble">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-black" />
            </div>
            <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-4 max-w-2xl">
              <p className="text-gray-200 leading-relaxed">Welcome to The Scholar! I'm your AI-powered biblical study assistant. I can help you with:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-4 w-4" />Biblical interpretation and exegesis</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-4 w-4" />Historical and cultural context</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-4 w-4" />Sermon preparation and outline creation</li>
                <li className="flex items-center"><Check className="text-[var(--scholar-gold)] mr-2 h-4 w-4" />Cross-references and thematic studies</li>
              </ul>
              <p className="mt-3 text-gray-400 text-sm">What would you like to study today?</p>
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
                <div className="flex items-start space-x-4 justify-end">
                  <div className="gradient-gold text-black rounded-2xl rounded-tr-none p-4 max-w-2xl">
                    <p>{msg.message}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-white" />
                  </div>
                </div>
              </div>

              {/* AI Response */}
              {msg.response && (
                <div className="scholar-chat-bubble">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="text-black" />
                    </div>
                    <div className="bg-[var(--scholar-dark)] rounded-2xl rounded-tl-none p-4 max-w-2xl">
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line">{msg.response}</p>
                      
                      <div className="mt-4 flex space-x-2">
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
                          onClick={() => handleSaveAction(msg.id, "Add to Sermon")}
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
          ))
        )}

        {/* Suggested Questions */}
        {(!messages || messages.length === 0) && !isLoading && (
          <div className="flex justify-center">
            <div className="bg-[var(--scholar-darker)] rounded-lg p-4 max-w-2xl">
              <h4 className="text-[var(--scholar-gold)] font-medium mb-3 text-center">Suggested Questions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left bg-[var(--scholar-dark)] hover:bg-gray-800 text-sm text-gray-300 p-3 border-gray-700 h-auto whitespace-normal"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Ask The Scholar about Scripture, theology, or sermon preparation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[var(--scholar-darker)] border-gray-700 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-[var(--scholar-gold)] resize-none min-h-[3rem] max-h-32"
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
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <button type="button" className="hover:text-white transition-colors">
                  <Paperclip className="mr-1 h-3 w-3" />
                  Attach
                </button>
                <button type="button" className="hover:text-white transition-colors">
                  <Mic className="mr-1 h-3 w-3" />
                  Voice
                </button>
                <button type="button" className="hover:text-white transition-colors">
                  <Book className="mr-1 h-3 w-3" />
                  Quote Scripture
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Press Ctrl+Enter to send
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
