import { useState, useEffect } from "react";
import ChatInterface from "@/components/chat-interface";
import MobileNavMenu from "@/components/mobile-nav-menu";
import WeeklyDonationPopup from "@/components/weekly-donation-popup";
import AppTutorial from "@/components/app-tutorial";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if tutorial should be shown
  useEffect(() => {
    const shouldShowTutorial = localStorage.getItem('show_tutorial');
    if (shouldShowTutorial === 'true') {
      setShowTutorial(true);
      localStorage.removeItem('show_tutorial'); // Remove after showing
    }
  }, []);



  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[var(--scholar-black)]">
      
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 max-h-screen">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">The Scholar</h2>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm lg:text-base">Online</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/profile">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <ChatInterface />
      </div>

      <WeeklyDonationPopup />
      <MobileNavMenu />
      
      {/* App Tutorial */}
      <AppTutorial isOpen={showTutorial} onClose={handleCloseTutorial} />
    </div>
  );
}
