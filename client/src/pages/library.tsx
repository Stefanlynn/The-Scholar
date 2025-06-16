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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Devotionals</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Devotional
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDevotionals.map((devotional) => (
          <Card key={devotional.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{devotional.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {devotional.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-[var(--scholar-darker)] text-gray-300">
                      {devotional.topic}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{devotional.description}</p>
                  {devotional.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{devotional.progress}%</span>
                      </div>
                      <Progress value={devotional.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  {devotional.progress > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Bible Reading Plans</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleReadingPlans.map((plan) => (
          <Card key={plan.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{plan.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {plan.type}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {plan.duration}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                  {plan.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {plan.progress > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Teaching & Sermon Resources</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleSermonResources.map((resource) => (
          <Card key={resource.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{resource.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {resource.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-[var(--scholar-darker)] text-gray-300">
                      {resource.category}
                    </Badge>
                  </div>
                  {resource.text && (
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="text-[var(--scholar-gold)]">Text:</span> {resource.text}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Study Tools</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Study
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleStudyTools.map((tool) => (
          <Card key={tool.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{tool.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {tool.type}
                    </Badge>
                    {tool.reference && (
                      <Badge variant="secondary" className="bg-[var(--scholar-darker)] text-gray-300">
                        {tool.reference}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 flex-1">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Study
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Theology Crash Courses</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTheologyCourses.map((course) => (
          <Card key={course.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2 flex items-center">
                    {course.title}
                    {course.completed && (
                      <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {course.type}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className={course.completed ? "bg-green-600 text-white hover:bg-green-700" : "bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"} 
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
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Audio & Podcast Library</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Plus className="h-4 w-4 mr-2" />
          Upload Audio
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleAudioContent.map((audio) => (
          <Card key={audio.id} className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{audio.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="border-[var(--scholar-gold)] text-[var(--scholar-gold)]">
                      {audio.type}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {audio.duration}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">by {audio.speaker}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Saved Content</h3>
        <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
          <Star className="h-4 w-4 mr-2" />
          View All Favorites
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-[var(--scholar-gold)]" />
              <div>
                <h4 className="text-white font-medium">Sermon Drafts</h4>
                <p className="text-gray-400 text-sm">12 items</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-[var(--scholar-gold)]" />
              <div>
                <h4 className="text-white font-medium">AI Chat Notes</h4>
                <p className="text-gray-400 text-sm">28 items</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-[var(--scholar-gold)]" />
              <div>
                <h4 className="text-white font-medium">Study Sessions</h4>
                <p className="text-gray-400 text-sm">15 items</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-[var(--scholar-gold)]" />
              <div>
                <h4 className="text-white font-medium">Favorites</h4>
                <p className="text-gray-400 text-sm">45 items</p>
              </div>
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
