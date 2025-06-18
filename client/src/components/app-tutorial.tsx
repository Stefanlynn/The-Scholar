import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle, 
  Sparkles,
  MessageSquare,
  BookOpen,
  PenTool,
  Edit3,
  Mic,
  Library,
  BookMarked,
  Settings,
  User,
  Heart,
  Search,
  Target,
  HelpCircle
} from "lucide-react";
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
      icon: <div className="w-12 h-12 text-[var(--scholar-gold)]"><img src={logoPath} alt="The Scholar" className="w-full h-full object-contain filter brightness-0 invert opacity-90" /></div>,
      content: "The Scholar combines cutting-edge AI with deep theological scholarship to revolutionize your Bible study. Whether you're preparing sermons, leading studies, or growing personally, our platform adapts to your unique ministry needs with expert biblical insights.",
      highlight: "AI meets Biblical Scholarship",
      gradient: "from-blue-600 to-purple-600",
      action: "Begin Tour",
      keyFeatures: [
        { title: "AI-Powered Insights", desc: "Get expert theological analysis instantly" },
        { title: "Professional Tools", desc: "Seminary-level study features at your fingertips" },
        { title: "Sermon Preparation", desc: "Transform notes into powerful messages" },
        { title: "Personal Growth", desc: "Devotional insights for spiritual development" }
      ],
      demoText: "Ready to explore God's Word like never before?"
    },
    {
      title: "Chat with The Scholar",
      subtitle: "AI conversations that adapt to your study goals",
      icon: <div className="relative"><div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center"><MessageSquare className="w-7 h-7 text-blue-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Sparkles className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Experience two distinct AI personalities with full voice conversation support. Study Mode provides academic theological analysis with Greek/Hebrew insights, while Devotional Mode offers warm, encouraging personal application. Have natural voice conversations or type your questions.",
      highlight: "Voice-enabled AI for every study need",
      gradient: "from-blue-500 to-cyan-500",
      keyFeatures: [
        { title: "Study Mode", desc: "Deep theological analysis and academic insights" },
        { title: "Devotional Mode", desc: "Heart-level encouragement and personal application" },
        { title: "Voice Conversations", desc: "Speak your questions and hear Scholar's responses" },
        { title: "Expert Voices", desc: "AI channels different theological scholars" },
        { title: "Save Responses", desc: "Keep important insights in your notes" }
      ],
      instructions: [
        "Click the mode toggle at the top to switch between Study and Devotional",
        "Ask questions by typing or clicking the microphone button to speak",
        "The Scholar responds with both text and voice for full conversation experience",
        "Use 'Save to Notes' to keep important responses",
        "Start new conversations with the 'New' button"
      ],
      action: "Continue Tour",
      demoText: "Ask anything about Scripture - from deep theology to daily application"
    },
    {
      title: "Bible Study Tools",
      subtitle: "Professional biblical analysis at your fingertips",
      icon: <div className="relative"><div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><BookOpen className="w-7 h-7 text-green-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Search className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Transform any verse into a comprehensive study session. Click on any verse to access Greek/Hebrew analysis, cross-references, commentary, cultural context, and more. It's like having a seminary library in your pocket.",
      highlight: "Seminary-level tools for every verse",
      gradient: "from-green-500 to-emerald-500",
      keyFeatures: [
        { title: "Greek & Hebrew Analysis", desc: "Original language word studies with definitions" },
        { title: "Cross-References", desc: "Related verses and thematic connections" },
        { title: "Historical Context", desc: "Cultural background and historical setting" },
        { title: "Ask The Scholar", desc: "Get AI insights about specific verses" }
      ],
      instructions: [
        "Navigate to any Bible chapter using the book/chapter selector",
        "Click on any verse number to open the study tools",
        "Choose from 6 different analysis tools in the popup",
        "Use 'Ask The Scholar' for specific questions about that verse"
      ],
      action: "Continue Tour",
      demoText: "Click any verse to unlock deep biblical insights"
    },
    {
      title: "Notes & Journaling",
      subtitle: "Organize your thoughts and spiritual insights",
      icon: <div className="relative"><div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center"><PenTool className="w-7 h-7 text-purple-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"><Edit3 className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Capture and organize your biblical insights with our comprehensive note-taking system. Create study notes, write daily journal entries, and develop sermon outlines all in one organized workspace.",
      highlight: "Three powerful writing tools in one place",
      gradient: "from-purple-500 to-pink-500",
      keyFeatures: [
        { title: "Study Notes", desc: "Organize insights by topic or scripture reference" },
        { title: "Daily Journal", desc: "Record personal reflections and prayers" },
        { title: "Sermon Workspace", desc: "Develop full sermons with AI assistance" },
        { title: "Search & Filter", desc: "Find any note instantly with powerful search" }
      ],
      instructions: [
        "Use the three tabs to switch between Notes, Journal, and Sermons",
        "Click the + button to create new entries",
        "Use the search bar to find specific notes quickly",
        "In Sermon Workspace, highlight text to access AI enhancement tools"
      ],
      action: "Continue Tour",
      demoText: "Write, enhance, and perfect your messages with AI assistance"
    },
    {
      title: "Sermon Preparation",
      subtitle: "From outline to pulpit with AI assistance",
      icon: <div className="relative"><div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center"><Mic className="w-7 h-7 text-orange-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><Sparkles className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Transform your study into powerful sermons using our AI-enhanced sermon workspace. Choose from different preaching styles, expand key points, add supporting scriptures, and create compelling illustrations - all with intelligent assistance.",
      highlight: "AI-powered sermon development",
      gradient: "from-orange-500 to-red-500",
      keyFeatures: [
        { title: "Writing Modes", desc: "Outline, Full Manuscript, or Bullet Points" },
        { title: "AI Enhancement", desc: "Expand ideas, add verses, create illustrations" },
        { title: "Preaching Styles", desc: "Prophetic, Teaching, Evangelistic, and more" },
        { title: "Outline Builder", desc: "Structured format with points and applications" }
      ],
      instructions: [
        "Go to Notes > Sermon Workspace tab to access sermon tools",
        "Choose your writing mode (Outline/Manuscript/Bullets)",
        "Highlight any text to see AI enhancement options",
        "Use the Outline Builder sidebar for structured sermon format"
      ],
      action: "Continue Tour",
      demoText: "Create sermons that connect hearts with heaven's truth"
    },
    {
      title: "Digital Library",
      subtitle: "Curated resources for spiritual growth",
      icon: <div className="relative"><div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center"><Library className="w-7 h-7 text-rose-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><BookMarked className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Access a carefully curated collection of spiritual resources designed for your growth and ministry effectiveness. From daily devotionals to theology courses, everything is organized for easy discovery and application.",
      highlight: "Endless learning opportunities",
      gradient: "from-rose-500 to-pink-500",
      keyFeatures: [
        { title: "Daily Devotionals", desc: "Structured spiritual growth content" },
        { title: "Reading Plans", desc: "Guided Bible reading with context" },
        { title: "Theology Courses", desc: "Deep dives into biblical doctrine" },
        { title: "Teaching Resources", desc: "Ready-to-use materials for ministry" }
      ],
      instructions: [
        "Browse featured content on the Library homepage",
        "Explore different categories: Podcasts, Articles, Devotionals, Sermons",
        "Track your progress through reading plans and courses",
        "Save favorite resources for quick access later"
      ],
      action: "Continue Tour",
      demoText: "Discover resources tailored to your ministry and growth"
    },
    {
      title: "Settings & Customization",
      subtitle: "Make The Scholar truly yours",
      icon: <div className="relative"><div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center"><Settings className="w-7 h-7 text-teal-400" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"><User className="w-2.5 h-2.5 text-white" /></div></div>,
      content: "Personalize your study environment to match your preferences and ministry context. Set your preferred Bible translation, customize the interface, and configure features to support your unique study style.",
      highlight: "Tailored to your preferences",
      gradient: "from-teal-500 to-cyan-500",
      keyFeatures: [
        { title: "Bible Translations", desc: "Choose from multiple trusted versions" },
        { title: "Profile Settings", desc: "Customize your ministry information" },
        { title: "App Tutorial", desc: "Restart this tour anytime" },
        { title: "Support & Help", desc: "Access guides and contact support" }
      ],
      instructions: [
        "Access Settings from the sidebar or mobile menu",
        "Update your profile information and ministry role",
        "Choose your preferred Bible translation",
        "Use 'App Tutorial' to restart this guide anytime"
      ],
      action: "Continue Tour",
      demoText: "Personalize every aspect of your study experience"
    },
    {
      title: "You're Ready to Begin",
      subtitle: "Start your enhanced Bible study journey",
      icon: <div className="relative"><div className="w-12 h-12 bg-[var(--scholar-gold)]/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-7 h-7 text-[var(--scholar-gold)]" /></div><div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--scholar-gold)] rounded-full flex items-center justify-center"><Heart className="w-2.5 h-2.5 text-black" /></div></div>,
      content: "Congratulations! You now have the knowledge to harness The Scholar's full potential for your biblical study and ministry preparation. Remember, help guides (?) are available throughout the app, and every feature is designed to deepen your understanding of God's Word.",
      highlight: "Begin your transformed study experience",
      gradient: "from-yellow-500 to-orange-500",
      keyFeatures: [
        { title: "Help Guides", desc: "Help buttons on every page for assistance", icon: <HelpCircle className="h-4 w-4 text-gray-400" /> },
        { title: "AI Chat", desc: "Ask questions anytime for instant insights" },
        { title: "Progressive Learning", desc: "Features unlock as you explore" },
        { title: "Continuous Updates", desc: "New features and content added regularly" }
      ],
      quickStart: [
        "Start with a question in Chat to break the ice",
        "Browse to your favorite Bible passage and explore the tools",
        "Create your first note or journal entry",
        "Check out the Library for devotional content"
      ],
      action: "Start Studying",
      demoText: "The Lord has great things in store for your study time"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSkip();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    localStorage.setItem('scholarTutorialCompleted', 'true');
    onClose();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--scholar-black)] overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTutorialStep.gradient} opacity-10`} />
      
      {/* Close Button */}
      <Button
        onClick={handleSkip}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 text-gray-400 hover:text-white z-20 bg-black/40 backdrop-blur-sm rounded-full w-10 h-10 p-0"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="relative z-10 h-full flex flex-col">
        {/* Progress Bar - Fixed at top */}
        <div className="flex-shrink-0 bg-[var(--scholar-black)]/90 backdrop-blur-sm border-b border-gray-800/50 px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-1 sm:space-x-2 max-w-6xl mx-auto">
            {tutorialSteps.map((_, index) => (
              <div key={index} className="flex-1 relative">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index <= currentStep 
                      ? "bg-[var(--scholar-gold)]"
                      : "bg-gray-700"
                  }`}
                />
                {index <= currentStep && (
                  <div className="absolute -top-1 -right-0.5 w-3 h-3 bg-[var(--scholar-gold)] rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {tutorialSteps.length}</span>
          </div>
        </div>

        {/* Main Content - Scrollable with touch optimization */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-6">
              {/* Icon with enhanced styling */}
              <div className="mb-4">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br ${currentTutorialStep.gradient} rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  {currentTutorialStep.icon}
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-2 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {currentTutorialStep.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-400 font-medium">
                  {currentTutorialStep.subtitle}
                </p>
              </div>

              {/* Highlight Badge */}
              <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r ${currentTutorialStep.gradient} rounded-full text-white font-semibold text-sm sm:text-base shadow-lg mb-6`}>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>{currentTutorialStep.highlight}</span>
              </div>
            </div>

            {/* Content Description */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed text-center">
                {currentTutorialStep.content}
              </p>
            </div>

            {/* Key Features Grid */}
            {currentTutorialStep.keyFeatures && (
              <div className="max-w-4xl mx-auto mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTutorialStep.keyFeatures.map((feature, index) => (
                    <div key={index} className="bg-[var(--scholar-dark)]/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all">
                      <div className="flex items-center space-x-2 mb-2">
                        {(feature as any).icon && (
                          <div className="p-1.5 bg-gray-600/30 rounded-lg">
                            {(feature as any).icon}
                          </div>
                        )}
                        <h4 className="text-base font-semibold text-white">{feature.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {currentTutorialStep.instructions && (
              <div className="max-w-4xl mx-auto mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">How to Use</h3>
                <div className="bg-[var(--scholar-dark)]/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
                  <div className="space-y-3">
                    {currentTutorialStep.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-5 h-5 bg-gradient-to-r ${currentTutorialStep.gradient} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-300">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Start (for final step) */}
            {currentTutorialStep.quickStart && (
              <div className="max-w-4xl mx-auto mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Start Guide</h3>
                <div className="bg-[var(--scholar-dark)]/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTutorialStep.quickStart.map((tip, index) => (
                      <div key={index} className="flex items-center space-x-3 text-gray-300">
                        <div className={`p-1.5 bg-gradient-to-r ${currentTutorialStep.gradient} rounded-lg flex-shrink-0`}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Demo Text */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-[var(--scholar-darker)]/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-[var(--scholar-gold)] text-center">
                <p className="text-[var(--scholar-gold)] font-medium italic text-sm sm:text-base">
                  "{currentTutorialStep.demoText}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Fixed at bottom */}
        <div className="sticky bottom-0 bg-[var(--scholar-black)]/90 backdrop-blur-sm border-t border-gray-800/50 px-3 sm:px-6 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Layout - Stacked */}
            <div className="flex flex-col space-y-3 sm:hidden">
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                  className={`border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all ${
                    currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-all"
                >
                  Skip
                </Button>
              </div>
              
              <Button
                onClick={handleNext}
                size="lg"
                className={`w-full bg-gradient-to-r ${currentTutorialStep.gradient} text-white hover:shadow-xl transition-all font-semibold`}
              >
                {currentTutorialStep.action}
                {currentStep < tutorialSteps.length - 1 ? (
                  <ArrowRight className="w-4 h-4 ml-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                size="lg"
                className={`border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all ${
                  currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-4">
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="lg"
                  className="text-gray-400 hover:text-white transition-all hover:scale-105"
                >
                  Skip Tour
                </Button>
                
                <Button
                  onClick={handleNext}
                  size="lg"
                  className={`bg-gradient-to-r ${currentTutorialStep.gradient} text-white hover:shadow-xl transition-all hover:scale-105 font-semibold px-8`}
                >
                  {currentTutorialStep.action}
                  {currentStep < tutorialSteps.length - 1 ? (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}