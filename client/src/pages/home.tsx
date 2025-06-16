import { useState } from "react";
import Sidebar from "@/components/sidebar";
import ChatInterface from "@/components/chat-interface";
import MobileTabBar from "@/components/mobile-tab-bar";
import QuickAccess from "@/components/quick-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <h2 className="text-lg md:text-xl font-semibold text-white">The Scholar</h2>
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
              <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium p-2 md:px-4 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ChatInterface />
      </div>

      <QuickAccess />
      <MobileTabBar />
    </div>
  );
}
