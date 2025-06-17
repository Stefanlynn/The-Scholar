import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Library, 
  User,
  ChevronRight, 
  ChevronLeft,
  X,
  Target,
  Lightbulb,
  Search,
  PenTool,
  Mic,
  Heart,
  Play,
  CheckCircle,
  Sparkles,
  BookMarked,
  Edit3,
  Settings,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/ZiNRAi-6_1750106841902.png";

interface AppTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppTutorial({ isOpen, onClose }: AppTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const tutorialSteps = [
    {
      title: "Welcome to The Scholar",
      subtitle: "Your AI-powered biblical study companion",
      icon: <img src={logoPath} alt="The Scholar" className="w-12 h-12" />,
      content: "Discover a revolutionary way to study Scripture with AI-powered insights, expert theological voices, and comprehensive study tools designed for pastors, teachers, and Bible students.",
      highlight: "Transform your Bible study experience",
      gradient: "from-blue-600 to-purple-600",
      action: "Begin Tour",
      demoText: "Ready to explore God's Word like never before?"
    },
    {
      title: "AI-Powered Chat",
      subtitle: "Two modes for every study need",
      icon: <MessageSquare className="w-12 h-12 text-blue-400" />,
      content: "Experience biblical insights through Study Mode for deep theological analysis and Devotional Mode for personal spiritual encouragement. Switch modes instantly based on your study goals.",
      highlight: "Expert voices adapt to your questions",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        { icon: <Sparkles className="w-4 h-4" />, text: "Expert theological voices" },
        { icon: <BookMarked className="w-4 h-4" />, text: "Greek/Hebrew word studies" },
        { icon: <Target className="w-4 h-4" />, text: "Cross-references & commentary" },
        { icon: <Heart className="w-4 h-4" />, text: "Personal application insights" }
      ],
      action: "Continue Tour",
      demoText: "Ask anything about Scripture - from deep theology to daily application"
    },
    {
      title: "Professional Bible Tools",
      subtitle: "Seminary-level study features",
      icon: <BookOpen className="w-12 h-12 text-green-400" />,
      content: "Access the same tools used in seminaries and by biblical scholars. Get original language analysis, historical context, cross-references, and commentary for every verse in Scripture.",
      highlight: "Professional study tools at your fingertips",
      gradient: "from-green-500 to-emerald-500",
      features: [
        { icon: <Search className="w-4 h-4" />, text: "Original language analysis" },
        { icon: <Target className="w-4 h-4" />, text: "Cross-reference networks" },
        { icon: <BookMarked className="w-4 h-4" />, text: "Historical & cultural context" },
        { icon: <MessageSquare className="w-4 h-4" />, text: "Verse-by-verse commentary" }
      ],
      action: "Continue Tour",
      demoText: "Click any verse to unlock deep biblical insights"
    },
    {
      title: "Notes & Sermon Workspace",
      subtitle: "From notes to pulpit-ready sermons",
      icon: <Edit3 className="w-12 h-12 text-purple-400" />,
      content: "Transform your study notes into powerful sermons. Use AI enhancement to expand ideas, rewrite for clarity, add supporting verses, and adapt to different preaching styles.",
      highlight: "Complete sermon preparation suite",
      gradient: "from-purple-500 to-pink-500",
      features: [
        { icon: <FileText className="w-4 h-4" />, text: "Smart note organization" },
        { icon: <PenTool className="w-4 h-4" />, text: "Daily journal reflections" },
        { icon: <Sparkles className="w-4 h-4" />, text: "AI-enhanced sermon writing" },
        { icon: <Mic className="w-4 h-4" />, text: "Multiple preaching styles" }
      ],
      action: "Continue Tour",
      demoText: "Write, enhance, and perfect your messages with AI assistance"
    },
    {
      title: "Digital Library",
      subtitle: "Comprehensive learning resources",
      icon: <Library className="w-12 h-12 text-rose-400" />,
      content: "Access a curated collection of devotionals, Bible reading plans, theology courses, and teaching resources. Everything organized for your spiritual growth and ministry preparation.",
      highlight: "Endless learning opportunities",
      gradient: "from-rose-500 to-pink-500",
      features: [
        { icon: <Heart className="w-4 h-4" />, text: "Daily devotionals" },
        { icon: <BookOpen className="w-4 h-4" />, text: "Bible reading plans" },
        { icon: <Lightbulb className="w-4 h-4" />, text: "Theology crash courses" },
        { icon: <Mic className="w-4 h-4" />, text: "Teaching resources" }
      ],
      action: "Continue Tour",
      demoText: "Discover resources tailored to your ministry and growth"
    },
    {
      title: "Personal Profile",
      subtitle: "Customize your study experience",
      icon: <Settings className="w-12 h-12 text-teal-400" />,
      content: "Make The Scholar truly yours. Set your preferred Bible translation, choose themes, configure ministry settings, and personalize your study environment for maximum effectiveness.",
      highlight: "Tailored to your preferences",
      gradient: "from-teal-500 to-cyan-500",
      features: [
        { icon: <BookOpen className="w-4 h-4" />, text: "Bible translation selection" },
        { icon: <Settings className="w-4 h-4" />, text: "Theme & appearance" },
        { icon: <User className="w-4 h-4" />, text: "Ministry role preferences" },
        { icon: <Target className="w-4 h-4" />, text: "Study preferences" }
      ],
      action: "Continue Tour",
      demoText: "Personalize every aspect of your study experience"
    },
    {
      title: "Ready to Begin",
      subtitle: "Your biblical study journey starts now",
      icon: <CheckCircle className="w-12 h-12 text-[var(--scholar-gold)]" />,
      content: "You're now equipped with powerful tools for deep biblical study. Remember, help guides (?) are available on every page, and The Scholar is always ready to assist your spiritual journey.",
      highlight: "Begin your transformed study experience",
      gradient: "from-yellow-500 to-orange-500",
      features: [
        { icon: <Target className="w-4 h-4" />, text: "Help guides on every page" },
        { icon: <Lightbulb className="w-4 h-4" />, text: "Context-sensitive tips" },
        { icon: <Play className="w-4 h-4" />, text: "Quick start suggestions" },
        { icon: <MessageSquare className="w-4 h-4" />, text: "Expert AI assistance" }
      ],
      action: "Start Studying",
      demoText: "The Lord has great things in store for your study time"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--scholar-black)] flex items-center justify-center">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTutorialStep.gradient} opacity-10`} />
      
      {/* Close Button */}
      <Button
        onClick={handleSkip}
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white z-20"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 h-screen flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
          {tutorialSteps.map((_, index) => (
            <div key={index} className="flex-1 relative">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  index <= currentStep 
                    ? "bg-[var(--scholar-gold)]"
                    : "bg-gray-700"
                }`}
              />
              {index <= currentStep && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content - Compact Layout */}
        <div className="text-center space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
          {/* Icon */}
          <div className="relative">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto bg-gradient-to-br ${currentTutorialStep.gradient} rounded-full flex items-center justify-center shadow-xl`}>
              {currentTutorialStep.icon}
            </div>
          </div>

          {/* Title and Subtitle - Compact */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {currentTutorialStep.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 font-medium">
              {currentTutorialStep.subtitle}
            </p>
          </div>

          {/* Highlight Badge - Compact */}
          <div className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r ${currentTutorialStep.gradient} rounded-full text-white font-semibold text-xs sm:text-sm shadow-lg`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>{currentTutorialStep.highlight}</span>
          </div>

          {/* Content - Shorter */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-2">
            {currentTutorialStep.content}
          </p>

          {/* Features Grid - Compact */}
          {currentTutorialStep.features && (
            <div className="bg-[var(--scholar-dark)]/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-800/50 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {currentTutorialStep.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300">
                    <div className={`p-1 bg-gradient-to-br ${currentTutorialStep.gradient} rounded flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Text - Compact */}
          <div className="bg-[var(--scholar-darker)]/80 rounded-lg p-3 sm:p-4 border-l-4 border-[var(--scholar-gold)] max-w-xl mx-auto">
            <p className="text-[var(--scholar-gold)] font-medium italic text-xs sm:text-sm">
              "{currentTutorialStep.demoText}"
            </p>
          </div>
        </div>

        {/* Navigation - Fixed Bottom */}
        <div className="flex items-center justify-between pt-4 pb-6">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="outline"
            className={`border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-xs sm:text-sm ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Previous
          </Button>

          {/* Step Counter - Center */}
          <div className="flex items-center space-x-1 text-xs sm:text-sm">
            <span className="text-gray-500">{currentStep + 1}</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-500">{tutorialSteps.length}</span>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-400 hover:text-white text-xs sm:text-sm"
            >
              Skip
            </Button>
            
            <Button
              onClick={handleNext}
              className={`bg-gradient-to-r ${currentTutorialStep.gradient} text-white hover:shadow-lg transition-all font-semibold text-xs sm:text-sm px-4 sm:px-6`}
            >
              {currentTutorialStep.action}
              {currentStep < tutorialSteps.length - 1 ? (
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              ) : (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}