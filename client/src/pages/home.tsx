import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChatInterface from "@/components/chat-interface";
import MobileTabBar from "@/components/mobile-tab-bar";
import WeeklyDonationPopup from "@/components/weekly-donation-popup";
import AppTutorial from "@/components/app-tutorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Search, User, LogOut, GraduationCap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
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
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-32 sm:w-48 md:w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-sm text-gray-300">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
                <Button 
                  onClick={handleSignOut}
                  className="bg-gray-700 text-white hover:bg-gray-600 p-2 rounded-full"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ChatInterface />
      </div>

      <WeeklyDonationPopup />
      <MobileTabBar />
    </div>
  );
}
