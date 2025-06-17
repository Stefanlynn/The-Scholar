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
    <div className="fixed inset-0 z-50 bg-[var(--scholar-black)] overflow-y-auto">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTutorialStep.gradient} opacity-10`} />
      
      {/* Close Button */}
      <Button
        onClick={handleSkip}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white z-20"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 mb-8 sm:mb-12 max-w-4xl mx-auto w-full">
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
                <div className="absolute -top-1 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-[var(--scholar-gold)] rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto w-full">
          {/* Icon */}
          <div className="relative">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br ${currentTutorialStep.gradient} rounded-full flex items-center justify-center shadow-2xl`}>
              {currentTutorialStep.icon}
            </div>
            <div className={`absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br ${currentTutorialStep.gradient} rounded-full animate-ping opacity-20`} />
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-2 sm:space-y-3 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight">
              {currentTutorialStep.title}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-400 font-medium">
              {currentTutorialStep.subtitle}
            </p>
          </div>

          {/* Highlight Badge */}
          <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r ${currentTutorialStep.gradient} rounded-full text-white font-semibold text-sm sm:text-lg shadow-lg mx-2`}>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-center">{currentTutorialStep.highlight}</span>
          </div>

          {/* Content */}
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto px-2">
            {currentTutorialStep.content}
          </p>

          {/* Features Grid */}
          {currentTutorialStep.features && (
            <div className="bg-[var(--scholar-dark)]/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-800/50 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {currentTutorialStep.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors">
                    <div className={`p-2 bg-gradient-to-br ${currentTutorialStep.gradient} rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <span className="font-medium text-sm sm:text-base">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Text */}
          <div className="bg-[var(--scholar-darker)]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border-l-4 border-[var(--scholar-gold)] max-w-2xl mx-auto">
            <p className="text-[var(--scholar-gold)] font-medium italic text-sm sm:text-lg">
              "{currentTutorialStep.demoText}"
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 max-w-2xl mx-auto space-y-4 sm:space-y-0">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className={`w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all ${
                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Previous
            </Button>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-gray-400 hover:text-white transition-all hover:scale-105"
              >
                Skip Tour
              </Button>
              
              <Button
                onClick={handleNext}
                size="lg"
                className={`w-full sm:w-auto bg-gradient-to-r ${currentTutorialStep.gradient} text-white hover:shadow-xl transition-all hover:scale-105 font-semibold px-6 sm:px-8`}
              >
                {currentTutorialStep.action}
                {currentStep < tutorialSteps.length - 1 ? (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                )}
              </Button>
            </div>
          </div>

          {/* Step Counter */}
          <div className="flex items-center justify-center space-x-2 pt-6 pb-8">
            <span className="text-sm text-gray-500">Step</span>
            <span className="text-lg font-bold text-[var(--scholar-gold)]">
              {currentStep + 1}
            </span>
            <span className="text-sm text-gray-500">of {tutorialSteps.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}