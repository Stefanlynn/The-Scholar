import { useState } from "react";
import { Book, Play, FileText, Headphones, Heart, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import PageHelp from "@/components/page-help";

const libraryHelpContent = {
  title: "How to Use Your Library",
  description: "Your personal collection of spiritual content including podcasts, articles, devotionals, and sermons. Access featured content and organize your spiritual resources.",
  features: [
    {
      title: "Featured Content",
      description: "Discover curated content recommendations and recently added resources",
      tips: [
        "Check featured content for new and trending spiritual resources",
        "Featured items are updated regularly with quality content",
        "Bookmark items you want to read or listen to later"
      ]
    },
    {
      title: "Podcasts",
      description: "Listen to biblical teachings, sermons, and spiritual discussions",
      tips: [
        "Stream podcasts directly or save for offline listening",
        "Follow your favorite teachers and ministries",
        "Create playlists for different topics or studies"
      ]
    },
    {
      title: "Articles & Devotionals",
      description: "Read in-depth biblical studies, daily devotionals, and spiritual insights",
      tips: [
        "Articles provide deep theological content and biblical analysis",
        "Devotionals offer daily spiritual encouragement and reflection",
        "Save articles to read later and take notes while reading"
      ]
    },
    {
      title: "Sermons",
      description: "Access recorded sermons and teaching messages from various speakers",
      tips: [
        "Browse sermons by topic, speaker, or scripture reference",
        "Use sermon content for study and sermon preparation",
        "Save memorable quotes and teaching points to your notes"
      ]
    }
  ]
};

export default function Library() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg md:text-xl font-semibold text-white">Library</h2>
              <PageHelp pageName="Library" helpContent={libraryHelpContent} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6 md:space-y-8">
          
          {/* Featured Content */}
          <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Featured Content</h2>
              <Button 
                variant="ghost" 
                className="text-[var(--scholar-gold)] hover:text-yellow-300 text-sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors">
                <CardContent className="p-4 md:p-6">
                  <div className="text-center text-gray-400">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Featured content will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Library Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Podcasts */}
            <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Podcasts
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Biblical teachings and spiritual discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Podcast content will be added here</p>
                </div>
              </CardContent>
            </Card>

            {/* Articles */}
            <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Articles
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Practical how-to guides and helpful resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Article content will be added here</p>
                </div>
              </CardContent>
            </Card>

            {/* Devotionals */}
            <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Book className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Devotionals
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Daily spiritual encouragement and reflection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Devotional content will be added here</p>
                </div>
              </CardContent>
            </Card>

            {/* Sermons */}
            <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Play className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Sermons
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recorded messages and teaching series
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Sermon content will be added here</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        <MobileTabBar />
      </div>
    </div>
  );
}