import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Book, 
  Calendar, 
  Users, 
  FileText, 
  GraduationCap, 
  Headphones, 
  Heart, 
  Play,
  Clock,
  Star,
  Download,
  Share,
  Bookmark,
  Plus,
  ChevronRight,
  Mic,
  BookOpen,
  Target,
  Zap
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[var(--scholar-dark)] via-[var(--scholar-darker)] to-black px-6 py-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">Your Library</h1>
                <p className="text-xl text-gray-300">Continue your spiritual journey</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[var(--scholar-darker)]/50 border-gray-600 text-white pl-12 w-80 h-12 text-lg focus:border-[var(--scholar-gold)]"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
            
            {/* Quick Access */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Content will be added here */}
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Quick access items will appear here</p>
                </div>
              </div>
            </section>

            {/* Featured Content */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Content</h2>
                <Button variant="ghost" className="text-[var(--scholar-gold)] hover:text-yellow-300">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Content will be added here */}
                <div className="col-span-full text-center py-12 text-gray-400">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Featured content will appear here</p>
                </div>
              </div>
            </section>

            {/* Collections Grid */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Browse Collections</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Content will be added here */}
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Collections will appear here</p>
                </div>
              </div>
            </section>

            {/* Recommended for You */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recommended for You</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Content will be added here */}
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recommended content will appear here</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}