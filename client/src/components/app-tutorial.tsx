import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  CheckCircle
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
      title: "Welcome to The Scholar!",
      icon: <img src={logoPath} alt="The Scholar" className="w-8 h-8" />,
      content: "Let's take a quick tour of your new biblical study companion. This interactive guide will show you all the powerful features at your fingertips.",
      highlight: "Get ready to transform your Bible study experience",
      action: "Start Tour"
    },
    {
      title: "Chat with The Scholar",
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      content: "Ask theological questions and get expert insights. Switch between Study Mode for academic analysis and Devotional Mode for heart-level encouragement.",
      highlight: "Two AI modes: Study & Devotional",
      features: [
        "Expert theological voices",
        "Greek/Hebrew word studies", 
        "Cross-references and commentary",
        "Personal application insights"
      ],
      action: "Try Chat",
      route: "/"
    },
    {
      title: "Advanced Bible Study",
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
      content: "Dive deep into Scripture with professional study tools. Get Greek/Hebrew analysis, cross-references, commentary, and cultural context for every verse.",
      highlight: "Professional Bible software features",
      features: [
        "Original language analysis",
        "Cross-reference networks",
        "Historical and cultural context",
        "Verse-by-verse commentary"
      ],
      action: "Explore Bible",
      route: "/bible"
    },
    {
      title: "Notes & Sermon Workspace", 
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      content: "Organize study notes, write daily reflections, and prepare sermons with AI enhancement. Choose from multiple writing modes and preaching styles.",
      highlight: "Complete sermon preparation suite",
      features: [
        "Smart note organization",
        "Daily journal reflections", 
        "AI-enhanced sermon writing",
        "Multiple preaching styles"
      ],
      action: "Try Notes",
      route: "/notes"
    },
    {
      title: "Digital Library",
      icon: <Library className="w-8 h-8 text-pink-500" />,
      content: "Access devotionals, reading plans, theology courses, and teaching resources. Everything you need for spiritual growth and ministry preparation.",
      highlight: "Comprehensive learning resources",
      features: [
        "Daily devotionals",
        "Bible reading plans",
        "Theology crash courses",
        "Teaching resources"
      ],
      action: "Browse Library",
      route: "/library"
    },
    {
      title: "Personal Profile",
      icon: <User className="w-8 h-8 text-teal-500" />,
      content: "Customize your experience with Bible translation preferences, themes, and personal settings. Make The Scholar truly yours.",
      highlight: "Personalized study experience",
      features: [
        "Bible translation selection",
        "Dark/light theme options",
        "Ministry role preferences",
        "Notification settings"
      ],
      action: "Visit Profile",
      route: "/profile"
    },
    {
      title: "You're All Set!",
      icon: <CheckCircle className="w-8 h-8 text-[var(--scholar-gold)]" />,
      content: "Congratulations! You've completed the tour. Remember, you can access help guides (?) on every page whenever you need assistance.",
      highlight: "Start your biblical study journey",
      features: [
        "Help guides on every page",
        "Context-sensitive tips",
        "Quick start suggestions",
        "Expert AI assistance"
      ],
      action: "Start Studying"
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

  const handleGoToSection = () => {
    const step = tutorialSteps[currentStep];
    if (step.route) {
      setLocation(step.route);
      onClose();
    } else {
      handleNext();
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/30 text-white max-w-2xl">
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 text-gray-400 hover:text-white z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6 pt-4">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep 
                      ? "bg-[var(--scholar-gold)]"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center space-y-6">
              {/* Icon and Title */}
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-[var(--scholar-darker)] rounded-full flex items-center justify-center border border-gray-600">
                  {currentTutorialStep.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {currentTutorialStep.title}
                </h2>
              </div>

              {/* Highlight Badge */}
              <Badge className="bg-[var(--scholar-gold)]/20 text-[var(--scholar-gold)] border-[var(--scholar-gold)]/30 px-4 py-1">
                {currentTutorialStep.highlight}
              </Badge>

              {/* Content */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                {currentTutorialStep.content}
              </p>

              {/* Features List */}
              {currentTutorialStep.features && (
                <div className="bg-[var(--scholar-darker)] rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    {currentTutorialStep.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    Skip Tour
                  </Button>
                  
                  <Button
                    onClick={handleGoToSection}
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
                  >
                    {currentTutorialStep.action}
                    {currentStep < tutorialSteps.length - 1 ? (
                      <ChevronRight className="w-4 h-4 ml-2" />
                    ) : (
                      <Play className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Step Counter */}
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}