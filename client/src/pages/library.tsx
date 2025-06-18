import { useState } from "react";
import { Book, Play, FileText, Headphones, Heart, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      title: "Content Categories",
      description: "Browse organized collections of spiritual content by type",
      tips: [
        "Podcasts: Audio teachings and sermons from various ministers",
        "Articles: Written content on theology, spiritual growth, and practical faith",
        "Devotionals: Daily readings and spiritual reflection materials",
        "Sermons: Video and audio messages from conferences and churches"
      ]
    },
    {
      title: "Personal Organization",
      description: "Save and organize content that resonates with your spiritual journey",
      tips: [
        "Heart items to add them to your personal favorites collection",
        "Use content for study preparation and spiritual growth",
        "Share meaningful content with your ministry team or small group"
      ]
    },
    {
      title: "Sermon Integration",
      description: "Use library content to enhance your teaching and preaching preparation",
      tips: [
        "Reference articles and teachings in your sermon notes",
        "Use sermon content for study and sermon preparation",
        "Save memorable quotes and teaching points to your notes"
      ]
    }
  ]
};

export default function Library() {
  return (
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
            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-700/50 hover:border-blue-500/70 transition-colors">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Book className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm md:text-base">Understanding Grace</h3>
                    <p className="text-xs md:text-sm text-gray-400">Featured Article</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-300 mb-3">Explore the depths of God's unmerited favor and how it transforms our daily walk with Christ.</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">Theology</Badge>
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 text-xs">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Content Categories */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Browse Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Podcasts */}
            <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Podcasts
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Audio teachings and conversations
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
                  Written content and studies
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
                  <Heart className="h-5 w-5 mr-2 text-[var(--scholar-gold)]" />
                  Devotionals
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Daily readings and reflections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-400 py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
        </section>
      </div>
    </div>
  );
}