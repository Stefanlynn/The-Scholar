import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChatInterface from "@/components/chat-interface";
import MobileNavMenu from "@/components/mobile-nav-menu";
import WeeklyDonationPopup from "@/components/weekly-donation-popup";
import AppTutorial from "@/components/app-tutorial";
import { Button } from "@/components/ui/button";
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
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg md:text-xl font-semibold text-white">The Scholar</h2>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/profile">
                <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
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
