import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

interface LoadingPageProps {
  onComplete: () => void;
  isReturningUser?: boolean;
}

export default function LoadingPage({ onComplete, isReturningUser = false }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay before transitioning
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--scholar-black)] via-gray-900 to-[var(--scholar-dark)] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto relative">
          <img 
            src={scholarLogo} 
            alt="The Scholar" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            {isReturningUser ? "Welcome Back" : "Welcome to The Scholar"}
          </h1>
          <p className="text-gray-300 text-lg">
            {isReturningUser 
              ? "Preparing your biblical study workspace..." 
              : "Initializing your biblical study companion..."
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className="text-gray-400 text-sm">
          Setting up your personalized study tools...
        </p>
      </div>
    </div>
  );
}