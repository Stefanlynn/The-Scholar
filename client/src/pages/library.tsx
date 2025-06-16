import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Search, BookOpen, Edit, Trash2, Calendar, Clock, Target, 
  GraduationCap, Mic, BookMarked, Heart, Play, CheckCircle, 
  FileText, Users, Lightbulb, Star, Download, Share
} from "lucide-react";
import type { LibraryItem } from "@shared/schema";

// Sample data for demonstration
const sampleDevotionals = [
  { id: 1, title: "Faith in Action", type: "5-day", topic: "Faith", progress: 60, description: "Discover practical ways to live out your faith daily" },
  { id: 2, title: "Healing Hearts", type: "30-day", topic: "Healing", progress: 20, description: "Journey through God's healing power in Scripture" },
  { id: 3, title: "Leadership Like Jesus", type: "topical", topic: "Leadership", progress: 0, description: "Learn servant leadership from Christ's example" }
];

const sampleReadingPlans = [
  { id: 1, title: "The Gospels in 30 Days", type: "themed", duration: "30 days", progress: 45, description: "Deep dive into Jesus' life and ministry" },
  { id: 2, title: "Chronological Bible", type: "chronological", duration: "365 days", progress: 12, description: "Read the Bible in historical order" },
  { id: 3, title: "Teaching Prep: Acts", type: "teaching", duration: "14 days", progress: 0, description: "Prepare to teach through the book of Acts" }
];

const sampleSermonResources = [
  { id: 1, title: "Grace Abounds", type: "expository", text: "Romans 5:20-21", category: "Sermon Outline" },
  { id: 2, title: "The Heart of Worship", type: "topical", text: "John 4:23-24", category: "Series Structure" },
  { id: 3, title: "Building Effective Messages", type: "guide", text: "", category: "Communication Guide" }
];

const sampleStudyTools = [
  { id: 1, title: "Love (Agape)", type: "word-study", reference: "G26", description: "Divine, unconditional love" },
  { id: 2, title: "Grace Cross-References", type: "cross-reference", reference: "Ephesians 2:8", description: "Connected passages on grace" },
  { id: 3, title: "Pharisees: Historical Context", type: "cultural", reference: "", description: "Understanding Jewish religious leaders" }
];

const sampleTheologyCourses = [
  { id: 1, title: "The Trinity Explained", duration: "15 min", type: "foundational", completed: false },
  { id: 2, title: "Salvation by Grace", duration: "20 min", type: "foundational", completed: true },
  { id: 3, title: "Identity in Christ", duration: "25 min", type: "identity", completed: false }
];

const sampleAudioContent = [
  { id: 1, title: "Faith Over Fear", type: "teaching", duration: "28:45", speaker: "Pastor John" },
  { id: 2, title: "Walking in Purpose", type: "podcast", duration: "35:20", speaker: "The Scholar" },
  { id: 3, title: "Uploaded: Sunday Service", type: "user", duration: "45:10", speaker: "Your Church" }
];

export default function Library() {
  const [activeTab, setActiveTab] = useState("devotionals");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Render component for each section
  const renderDevotionals = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Devotionals</h3>
          <p className="text-gray-400">Grow deeper in your faith with structured devotional journeys</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Devotional
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleDevotionals.map((devotional) => (
          <Card key={devotional.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <Heart className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {devotional.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-0">
                    {devotional.topic}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {devotional.title}
              </CardTitle>
              <p className="text-gray-400 text-sm leading-relaxed">{devotional.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              {devotional.progress > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-[var(--scholar-gold)] font-medium">{devotional.progress}%</span>
                  </div>
                  <Progress value={devotional.progress} className="h-2 bg-gray-700" />
                </div>
              )}
              <div className="flex space-x-3">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md">
                  <Play className="h-4 w-4 mr-2" />
                  {devotional.progress > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReadingPlans = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Bible Reading Plans</h3>
          <p className="text-gray-400">Journey through Scripture with guided reading plans</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleReadingPlans.map((plan) => (
          <Card key={plan.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {plan.type}
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm bg-gray-700/30 px-2 py-1 rounded-md">
                    <Calendar className="h-3 w-3 mr-1" />
                    {plan.duration}
                  </div>
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {plan.title}
              </CardTitle>
              <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              {plan.progress > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-[var(--scholar-gold)] font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2 bg-gray-700" />
                </div>
              )}
              <div className="flex space-x-3">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {plan.progress > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSermonResources = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Teaching & Sermon Resources</h3>
          <p className="text-gray-400">Equip yourself with sermon outlines, series structures, and communication guides</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleSermonResources.map((resource) => (
          <Card key={resource.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <Mic className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {resource.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-0">
                    {resource.category}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {resource.title}
              </CardTitle>
              {resource.text && (
                <div className="bg-gray-800/50 p-3 rounded-lg mb-3">
                  <p className="text-sm">
                    <span className="text-[var(--scholar-gold)] font-medium">Scripture:</span>{" "}
                    <span className="text-gray-300">{resource.text}</span>
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-3">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md">
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStudyTools = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Study Tools</h3>
          <p className="text-gray-400">Deep dive into Scripture with word studies, cross-references, and cultural context</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Study
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleStudyTools.map((tool) => (
          <Card key={tool.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {tool.type}
                  </Badge>
                  {tool.reference && (
                    <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-0 font-mono text-xs">
                      {tool.reference}
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {tool.title}
              </CardTitle>
              <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-3">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Study
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTheologyCourses = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Theology Crash Courses</h3>
          <p className="text-gray-400">Build a solid foundation with short, focused lessons on core biblical truths</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleTheologyCourses.map((course) => (
          <Card key={course.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {course.type}
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm bg-gray-700/30 px-2 py-1 rounded-md">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </div>
                  {course.completed && (
                    <div className="p-1 bg-green-500/20 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className={course.completed 
                    ? "bg-green-600 text-white hover:bg-green-700 flex-1 font-medium shadow-md" 
                    : "bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md"
                  } 
                  disabled={course.completed}
                >
                  {course.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAudioLibrary = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Audio & Podcast Library</h3>
          <p className="text-gray-400">Listen to teachings, podcasts, and uploaded content on the go</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Plus className="h-4 w-4 mr-2" />
          Upload Audio
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleAudioContent.map((audio) => (
          <Card key={audio.id} className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-[var(--scholar-gold)]/10 rounded-lg">
                  <Play className="h-6 w-6 text-[var(--scholar-gold)]" />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-[var(--scholar-gold)]/30 text-[var(--scholar-gold)] bg-[var(--scholar-gold)]/5 font-medium">
                    {audio.type}
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm bg-gray-700/30 px-2 py-1 rounded-md">
                    <Clock className="h-3 w-3 mr-1" />
                    {audio.duration}
                  </div>
                </div>
              </div>
              <CardTitle className="text-white text-xl mb-2 group-hover:text-[var(--scholar-gold)] transition-colors">
                {audio.title}
              </CardTitle>
              <p className="text-gray-400 text-sm">by <span className="text-gray-300 font-medium">{audio.speaker}</span></p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-3">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-400 flex-1 font-medium shadow-md">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-[var(--scholar-gold)] hover:text-[var(--scholar-gold)]">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSavedContent = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Saved Content</h3>
          <p className="text-gray-400">Quick access to your drafts, notes, study sessions, and favorites</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--scholar-gold)] to-yellow-400 text-black hover:from-yellow-400 hover:to-[var(--scholar-gold)] shadow-lg font-semibold px-6">
          <Star className="h-4 w-4 mr-2" />
          View All Favorites
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group cursor-pointer">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-[var(--scholar-gold)]/10 rounded-xl">
                <FileText className="h-8 w-8 text-[var(--scholar-gold)]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-[var(--scholar-gold)] transition-colors">12</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Items</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1 group-hover:text-[var(--scholar-gold)] transition-colors">Sermon Drafts</h4>
              <p className="text-gray-400 text-sm">Work in progress sermons and outlines</p>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group cursor-pointer">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-[var(--scholar-gold)]/10 rounded-xl">
                <GraduationCap className="h-8 w-8 text-[var(--scholar-gold)]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-[var(--scholar-gold)] transition-colors">28</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Items</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1 group-hover:text-[var(--scholar-gold)] transition-colors">AI Chat Notes</h4>
              <p className="text-gray-400 text-sm">Saved conversations with The Scholar</p>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group cursor-pointer">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-[var(--scholar-gold)]/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-[var(--scholar-gold)]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-[var(--scholar-gold)] transition-colors">15</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Items</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1 group-hover:text-[var(--scholar-gold)] transition-colors">Study Sessions</h4>
              <p className="text-gray-400 text-sm">Personal Bible study notes and insights</p>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-[var(--scholar-dark)] to-[var(--scholar-darker)] border-gray-700 hover:border-[var(--scholar-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--scholar-gold)]/10 group cursor-pointer">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-[var(--scholar-gold)]/10 rounded-xl">
                <Heart className="h-8 w-8 text-[var(--scholar-gold)]" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-[var(--scholar-gold)] transition-colors">45</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Items</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-1 group-hover:text-[var(--scholar-gold)] transition-colors">Favorites</h4>
              <p className="text-gray-400 text-sm">Bookmarked verses and resources</p>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Library</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white pl-10 w-64 focus:border-[var(--scholar-gold)]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="border-b border-gray-800 bg-[var(--scholar-darker)]">
              <TabsList className="grid w-full grid-cols-7 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="devotionals" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Devotionals
                </TabsTrigger>
                <TabsTrigger 
                  value="reading-plans" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reading Plans
                </TabsTrigger>
                <TabsTrigger 
                  value="sermon-resources" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Sermons
                </TabsTrigger>
                <TabsTrigger 
                  value="study-tools" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Study Tools
                </TabsTrigger>
                <TabsTrigger 
                  value="theology-courses" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Theology
                </TabsTrigger>
                <TabsTrigger 
                  value="audio-library" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Audio
                </TabsTrigger>
                <TabsTrigger 
                  value="saved-content" 
                  className="data-[state=active]:bg-[var(--scholar-gold)] data-[state=active]:text-black text-gray-300 border-b-2 border-transparent data-[state=active]:border-[var(--scholar-gold)] rounded-none py-3"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="devotionals" className="mt-0">
                {renderDevotionals()}
              </TabsContent>

              <TabsContent value="reading-plans" className="mt-0">
                {renderReadingPlans()}
              </TabsContent>

              <TabsContent value="sermon-resources" className="mt-0">
                {renderSermonResources()}
              </TabsContent>

              <TabsContent value="study-tools" className="mt-0">
                {renderStudyTools()}
              </TabsContent>

              <TabsContent value="theology-courses" className="mt-0">
                {renderTheologyCourses()}
              </TabsContent>

              <TabsContent value="audio-library" className="mt-0">
                {renderAudioLibrary()}
              </TabsContent>

              <TabsContent value="saved-content" className="mt-0">
                {renderSavedContent()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
