import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  ChevronRight, 
  FileText, 
  Library, 
  User, 
  Search,
  Lightbulb,
  Quote,
  PenTool,
  Mic,
  Heart,
  Zap,
  Target,
  ChevronLeft,
  Play
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import logoPath from "@assets/ZiNRAi-6_1750106841902.png";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      
      // Update user metadata to mark onboarding as complete
      if (user) {
        await supabase.auth.updateUser({
          data: { completed_onboarding: true }
        });
      }
      
      setLocation("/");
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--scholar-gold)] to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <img src={logoPath} alt="The Scholar" className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome to The Scholar</h1>
                    <p className="text-gray-300 text-sm md:text-base">Your AI-powered biblical study companion</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-[var(--scholar-gold)]/20 to-[var(--scholar-gold)]/5 rounded-lg p-4 border border-[var(--scholar-gold)]/20">
                    <p className="text-gray-200 text-sm leading-relaxed">
                      Designed for pastors, teachers, and Bible students who want deeper Scripture insights with expert theological perspectives.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="text-blue-400 w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-300 text-center">AI Study Modes</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Search className="text-green-400 w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-300 text-center">Bible Tools</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleNext}
                  className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium py-3"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Powerful Features</h2>
                  <p className="text-gray-300 text-sm">Everything you need for biblical study</p>
                </div>
                
                <div className="space-y-3">
                  {/* Chat Feature */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-blue-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">AI Study Companion</h3>
                        <p className="text-gray-400 text-xs">Expert insights with Study & Devotional modes</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bible Tools */}
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-green-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">Advanced Bible Study</h3>
                        <p className="text-gray-400 text-xs">Greek/Hebrew analysis & cross-references</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes & Journaling */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="text-purple-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">Notes & Sermon Prep</h3>
                        <p className="text-gray-400 text-xs">AI-enhanced writing & organization</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Library */}
                  <div className="bg-gradient-to-r from-pink-500/20 to-pink-600/10 rounded-lg p-4 border border-pink-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <Library className="text-pink-400 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">Digital Library</h3>
                        <p className="text-gray-400 text-xs">Devotionals, courses & teaching resources</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handlePrev}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
            </div>

            <div className="flex justify-center items-center space-x-4 pt-6">
              <Button 
                onClick={handlePrev}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-green-600 text-white hover:bg-green-700 font-medium px-8 py-3 text-lg"
              >
                See How It Works
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[var(--scholar-gold)] to-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Play className="text-black w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Begin Your Journey?
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Start exploring The Scholar with an interactive guided tour, or jump right into the experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Guided Tour Option */}
              <div className="bg-gradient-to-br from-[var(--scholar-gold)]/20 to-[var(--scholar-gold)]/10 rounded-xl p-8 border border-[var(--scholar-gold)]/30 text-center">
                <div className="w-16 h-16 bg-[var(--scholar-gold)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-black w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Take the Guided Tour</h3>
                <p className="text-gray-300 mb-6">
                  Get a step-by-step walkthrough of every feature. Perfect for first-time users who want to see everything The Scholar offers.
                </p>
                <div className="space-y-3 text-sm text-gray-400 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat & AI Modes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Bible Study Tools</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Notes & Sermon Prep</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Library className="w-4 h-4" />
                    <span>Digital Library</span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setLoading(true);
                    // Mark to show tutorial
                    localStorage.setItem('show_tutorial', 'true');
                    handleNext();
                  }}
                  disabled={loading}
                  className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium py-3"
                >
                  {loading ? "Starting Tour..." : "Start Guided Tour"}
                  <Target className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Skip to App Option */}
              <div className="bg-[var(--scholar-darker)] rounded-xl p-8 border border-gray-600 text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Jump Right In</h3>
                <p className="text-gray-300 mb-6">
                  Skip the tour and start using The Scholar immediately. You can always access help guides from any page.
                </p>
                <div className="space-y-3 text-sm text-gray-400 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓ Help guides on every page</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓ Context-sensitive tips</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓ Quick start suggestions</span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setLoading(true);
                    // Don't show tutorial
                    localStorage.setItem('show_tutorial', 'false');
                    handleNext();
                  }}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-700 font-medium py-3"
                >
                  {loading ? "Loading..." : "Skip to App"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handlePrev}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Features
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-[var(--scholar-dark)] border-gray-800">
        <CardContent className="p-8 md:p-12">
          {renderStep()}
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-12 space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step === currentStep
                    ? currentStep === 1 
                      ? "bg-[var(--scholar-gold)]"
                      : currentStep === 2
                      ? "bg-green-600"
                      : "bg-blue-600"
                    : step < currentStep
                    ? "bg-gray-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}