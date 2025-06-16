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

  const featuredContent = [
    {
      title: "The Power of Identity",
      subtitle: "5-Day Devotional Series",
      description: "Discover who you are as a son or daughter of the King",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=200&fit=crop",
      duration: "5 days",
      category: "Devotional",
      progress: 60,
      isNew: true
    },
    {
      title: "Prophetic Preaching Masterclass",
      subtitle: "with Kris Vallotton",
      description: "Learn to preach with prophetic insight and supernatural power",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      duration: "2.5 hours",
      category: "Teaching",
      isNew: false
    },
    {
      title: "Supernatural Breakthrough",
      subtitle: "Audio Teaching Series",
      description: "Breaking through limitations into your divine destiny",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop", 
      duration: "45 min",
      category: "Audio",
      isNew: false
    }
  ];

  const quickAccess = [
    {
      title: "Continue Reading",
      subtitle: "Matthew 5",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Today's Devotional",
      subtitle: "Day 3 of 5",
      icon: Heart,
      color: "bg-red-500"
    },
    {
      title: "Sermon Notes",
      subtitle: "3 drafts",
      icon: FileText,
      color: "bg-green-500"
    },
    {
      title: "Study Progress",
      subtitle: "Romans",
      icon: Target,
      color: "bg-purple-500"
    }
  ];

  const collections = [
    {
      title: "Devotionals & Spiritual Growth",
      description: "Daily devotionals and spiritual formation content",
      count: "24 items",
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=200&fit=crop",
      items: [
        { title: "Identity in Christ", type: "5-day series", progress: 80 },
        { title: "Hearing God's Voice", type: "21-day journey", progress: 45 },
        { title: "Kingdom Living", type: "7-day devotional", progress: 0 }
      ]
    },
    {
      title: "Bible Reading Plans",
      description: "Structured plans to read through Scripture",
      count: "12 plans",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
      items: [
        { title: "Chronological Bible", type: "365 days", progress: 23 },
        { title: "New Testament", type: "90 days", progress: 67 },
        { title: "Psalms & Proverbs", type: "31 days", progress: 12 }
      ]
    },
    {
      title: "Teaching & Sermon Resources",
      description: "Preaching resources and ministry tools",
      count: "18 resources",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      items: [
        { title: "Prophetic Preaching", type: "Masterclass", progress: 0 },
        { title: "Sermon Outlines", type: "52 sermons", progress: 30 },
        { title: "Teaching Methods", type: "Workshop", progress: 100 }
      ]
    },
    {
      title: "Audio Library",
      description: "Teachings, podcasts, and audio content",
      count: "45 hours",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
      items: [
        { title: "Supernatural Breakthrough", type: "45 min", progress: 0 },
        { title: "Kingdom Culture", type: "Series", progress: 25 },
        { title: "Morning Prayers", type: "Playlist", progress: 50 }
      ]
    }
  ];

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
                {quickAccess.map((item, index) => (
                  <Card key={index} className="bg-[var(--scholar-dark)] border-gray-700 hover:border-[var(--scholar-gold)] transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {featuredContent.map((content, index) => (
                  <Card key={index} className="bg-[var(--scholar-dark)] border-gray-700 overflow-hidden hover:border-[var(--scholar-gold)] transition-all group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={content.image} 
                        alt={content.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        {content.isNew && (
                          <Badge className="bg-[var(--scholar-gold)] text-black">New</Badge>
                        )}
                        <Badge variant="outline" className="text-white border-white/30">
                          {content.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-white text-sm flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {content.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{content.title}</h3>
                      <p className="text-[var(--scholar-gold)] font-medium mb-2">{content.subtitle}</p>
                      <p className="text-gray-400 mb-4">{content.description}</p>
                      {content.progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{content.progress}%</span>
                          </div>
                          <Progress value={content.progress} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Collections Grid */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Browse Collections</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {collections.map((collection, index) => (
                  <Card key={index} className="bg-[var(--scholar-dark)] border-gray-700 overflow-hidden hover:border-[var(--scholar-gold)] transition-all group cursor-pointer">
                    <div className="flex">
                      {/* Image Section */}
                      <div className="w-32 lg:w-40 flex-shrink-0 relative">
                        <img 
                          src={collection.image} 
                          alt={collection.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      
                      {/* Content Section */}
                      <CardContent className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{collection.title}</h3>
                            <p className="text-gray-400 text-sm">{collection.description}</p>
                          </div>
                          <Badge variant="outline" className="text-[var(--scholar-gold)] border-[var(--scholar-gold)]/30">
                            {collection.count}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {collection.items.slice(0, 3).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between py-1">
                              <div>
                                <p className="text-white text-sm font-medium">{item.title}</p>
                                <p className="text-gray-400 text-xs">{item.type}</p>
                              </div>
                              {item.progress > 0 && (
                                <div className="w-16">
                                  <Progress value={item.progress} className="h-1" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="ghost" className="w-full mt-4 text-[var(--scholar-gold)] hover:text-yellow-300 hover:bg-[var(--scholar-gold)]/10">
                          Explore Collection <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recommended for You */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recommended for You</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Prayer & Fasting Guide", type: "21-day journey", image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=120&fit=crop" },
                  { title: "Leadership Principles", type: "Masterclass", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=120&fit=crop" },
                  { title: "Worship & Intimacy", type: "Audio series", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=120&fit=crop" },
                  { title: "Biblical Counseling", type: "Workshop", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=120&fit=crop" }
                ].map((item, index) => (
                  <Card key={index} className="bg-[var(--scholar-dark)] border-gray-700 overflow-hidden hover:border-[var(--scholar-gold)] transition-all group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}