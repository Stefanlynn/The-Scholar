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
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <img src={logoPath} alt="The Scholar Logo" className="w-16 h-16" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">The Scholar</h1>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[var(--scholar-gold)]/20 to-[var(--scholar-gold)]/10 rounded-xl p-6 border border-[var(--scholar-gold)]/30">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Your AI-Powered Biblical Study Companion
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Designed for pastors, teachers, and Bible students who want to dive deeper into Scripture with 
                  authentic insights, expert theological perspectives, and powerful study tools.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-[var(--scholar-darker)] rounded-lg p-6 text-left">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-white w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Study & Devotional Modes</h3>
                  </div>
                  <p className="text-gray-400">Switch between academic analysis and heart-level encouragement based on your study needs.</p>
                </div>
                
                <div className="bg-[var(--scholar-darker)] rounded-lg p-6 text-left">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Search className="text-white w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Advanced Bible Tools</h3>
                  </div>
                  <p className="text-gray-400">Greek/Hebrew analysis, cross-references, commentary, and cultural context for every verse.</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleNext}
              className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium px-8 py-3 text-lg"
            >
              Explore Features
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Powerful Features at Your Fingertips
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Everything you need for deep biblical study, sermon preparation, and spiritual growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chat with The Scholar */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Chat with The Scholar</h3>
                <p className="text-gray-300 mb-4">Ask theological questions and get expert insights with Study Mode or Devotional Mode responses.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">Expert Voices</Badge>
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">Two Modes</Badge>
                </div>
              </div>

              {/* Bible Study Tools */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Advanced Bible Study</h3>
                <p className="text-gray-300 mb-4">Greek/Hebrew analysis, cross-references, commentary, and cultural context for every verse.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300">Original Languages</Badge>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300">Cross-Refs</Badge>
                </div>
              </div>

              {/* Notes & Journaling */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Notes & Journaling</h3>
                <p className="text-gray-300 mb-4">Organize study notes, daily reflections, and sermon preparation with tagging and search.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">Smart Tags</Badge>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">Search</Badge>
                </div>
              </div>

              {/* Sermon Workspace */}
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-6 border border-orange-500/30">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Mic className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Sermon Workspace</h3>
                <p className="text-gray-300 mb-4">AI-enhanced sermon preparation with multiple writing modes and preaching styles.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">AI Enhancement</Badge>
                  <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">5 Styles</Badge>
                </div>
              </div>

              {/* Digital Library */}
              <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 rounded-xl p-6 border border-pink-500/30">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Library className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Digital Library</h3>
                <p className="text-gray-300 mb-4">Access devotionals, reading plans, theology courses, and teaching resources.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-pink-600/20 text-pink-300">Devotionals</Badge>
                  <Badge variant="secondary" className="bg-pink-600/20 text-pink-300">Courses</Badge>
                </div>
              </div>

              {/* Personal Profile */}
              <div className="bg-gradient-to-br from-teal-600/20 to-teal-800/20 rounded-xl p-6 border border-teal-500/30">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <User className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Personal Settings</h3>
                <p className="text-gray-300 mb-4">Customize Bible translations, themes, and personalize your study experience.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-teal-600/20 text-teal-300">Customizable</Badge>
                  <Badge variant="secondary" className="bg-teal-600/20 text-teal-300">Themes</Badge>
                </div>
              </div>
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