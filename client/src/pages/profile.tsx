import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Phone, 
  Edit, 
  Camera, 
  BookOpen,
  Heart,
  Star,
  Trophy,
  Clock,
  CheckCircle,
  Upload,
  Flame,
  Target,
  TrendingUp,
  MessageSquare,
  Bookmark as BookmarkIcon,
  FileText,
  ChevronRight,
  BarChart3,
  Award,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import type { User as UserType } from "@shared/schema";

interface ProfileStats {
  totalNotes: number;
  totalBookmarks: number;
  totalChatMessages: number;
  streak: number;
  lastLoginDate: string;
  recentActivity: number;
  studyTimeThisWeek: number;
}

export default function Profile() {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const { data: stats } = useQuery<ProfileStats>({
    queryKey: ["/api/profile/stats"],
    enabled: !!user,
  });

  const { data: recentNotes } = useQuery<any[]>({
    queryKey: ["/api/notes", "recent"],
    enabled: !!user,
  });

  const { data: recentBookmarks } = useQuery<any[]>({
    queryKey: ["/api/bookmarks", "recent"],
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      const response = await apiRequest("PATCH", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      setIsEditing(false);
      // Invalidate all user-related queries to update the entire app
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      bio: formData.get("bio") as string,
      ministryRole: formData.get("ministryRole") as string,
      defaultBibleTranslation: formData.get("defaultBibleTranslation") as string,
      darkMode: formData.get("darkMode") === "on",
      notifications: formData.get("notifications") === "on",
    };
    updateProfileMutation.mutate(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch('/api/profile/upload-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({ title: "Profile picture updated successfully!" });
        // Invalidate profile query to refresh the image
        queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({ title: "Failed to upload profile picture", variant: "destructive" });
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <h2 className="text-lg md:text-xl font-semibold text-white">Profile</h2>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 px-3 md:px-4"
              >
                <Edit className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Edit Profile</span>
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700 px-3 md:px-4"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-4 md:space-y-6">
        
        {/* User Info Section */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    {profile?.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      onClick={triggerFileUpload}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Full Name</label>
                    <Input
                      name="fullName"
                      defaultValue={profile?.fullName || user?.user_metadata?.full_name || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Email</label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={profile?.email || user?.email || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      name="bio"
                      placeholder="Tell us about yourself..."
                      defaultValue={profile?.bio || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Ministry Role</label>
                    <Input
                      name="ministryRole"
                      placeholder="Pastor, Teacher, Student..."
                      defaultValue={profile?.ministryRole || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    {profile?.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {profile?.fullName || user?.user_metadata?.full_name || "User"}
                    </h3>
                    <p className="text-gray-400">{profile?.email || user?.email}</p>
                    {profile?.ministryRole && (
                      <p className="text-[var(--scholar-gold)] font-medium">{profile.ministryRole}</p>
                    )}
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <h4 className="text-white font-medium mb-2">About</h4>
                    <p className="text-gray-300">{profile.bio}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white text-sm font-medium">Default Bible Translation</label>
                    <p className="text-gray-400 text-xs">Choose your preferred Bible version</p>
                  </div>
                  <select
                    value={profile?.defaultBibleTranslation || "NIV"}
                    onChange={(e) => updatePreferences({ defaultBibleTranslation: e.target.value })}
                    className="bg-[var(--scholar-darker)] border border-gray-600 text-white rounded px-3 py-1 text-sm"
                  >
                    <option value="NIV">NIV</option>
                    <option value="ESV">ESV</option>
                    <option value="KJV">KJV</option>
                    <option value="NASB">NASB</option>
                    <option value="NLT">NLT</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white text-sm font-medium">Dark Mode</label>
                    <p className="text-gray-400 text-xs">Toggle dark theme</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePreferences({ darkMode: !(profile?.darkMode ?? true) })}
                    className={`${profile?.darkMode ?? true ? 'bg-[var(--scholar-gold)] text-black' : 'bg-gray-700 text-white'} hover:opacity-80`}
                  >
                    {profile?.darkMode ?? true ? "On" : "Off"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white text-sm font-medium">Notifications</label>
                    <p className="text-gray-400 text-xs">Receive study reminders</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePreferences({ notifications: !(profile?.notifications ?? true) })}
                    className={`${profile?.notifications ?? true ? 'bg-[var(--scholar-gold)] text-black' : 'bg-gray-700 text-white'} hover:opacity-80`}
                  >
                    {profile?.notifications ?? true ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white text-sm font-medium">Ministry Role</label>
                    <p className="text-gray-400 text-xs">Your role in ministry</p>
                  </div>
                  <span className="text-[var(--scholar-gold)] text-sm">
                    {profile?.ministryRole || "Not set"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Dashboard Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[var(--scholar-dark)] border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.streak || 0}</p>
                <p className="text-xs text-gray-400">Day Streak</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-[var(--scholar-dark)] border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.totalNotes || 0}</p>
                <p className="text-xs text-gray-400">Total Notes</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-[var(--scholar-dark)] border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <BookmarkIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.totalBookmarks || 0}</p>
                <p className="text-xs text-gray-400">Bookmarks</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-[var(--scholar-dark)] border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.totalChatMessages || 0}</p>
                <p className="text-xs text-gray-400">AI Chats</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Progress */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[var(--scholar-gold)]/20 rounded-full">
                    <Flame className="h-6 w-6 text-[var(--scholar-gold)]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Current Streak</p>
                    <p className="text-gray-400 text-sm">Keep it going!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[var(--scholar-gold)]">{stats?.streak || 0}</p>
                  <p className="text-gray-400 text-sm">days</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">This Week's Activity</span>
                  <span className="text-white font-medium">{stats?.recentActivity || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[var(--scholar-gold)] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(stats?.recentActivity || 0, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-[var(--scholar-gold)]" />
                  <span className="text-gray-300 text-sm">Study time: {stats?.studyTimeThisWeek || 0}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/" className="block">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Start Bible Study</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              
              <Link href="/notes" className="block">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-400" />
                    <span className="text-white">Create New Note</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              
              <Link href="/bible" className="block">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    <span className="text-white">Read Scripture</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
              
              <Link href="/library" className="block">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">Browse Library</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Notes
              </CardTitle>
              <Link href="/notes">
                <Button variant="ghost" size="sm" className="text-[var(--scholar-gold)] hover:bg-gray-700">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentNotes && recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {recentNotes.slice(0, 3).map((note: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {note.title || 'Untitled Note'}
                      </h4>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {note.content || 'No content'}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No notes yet</p>
                  <Link href="/notes">
                    <Button size="sm" className="mt-2 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
                      Create Your First Note
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookmarks */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-white flex items-center">
                <BookmarkIcon className="h-5 w-5 mr-2" />
                Recent Bookmarks
              </CardTitle>
              <Link href="/bible">
                <Button variant="ghost" size="sm" className="text-[var(--scholar-gold)] hover:bg-gray-700">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentBookmarks && recentBookmarks.length > 0 ? (
                <div className="space-y-3">
                  {recentBookmarks.slice(0, 3).map((bookmark: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {bookmark.verseReference || 'Scripture Bookmark'}
                      </h4>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {bookmark.notes || bookmark.verseText || 'Bookmarked verse'}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookmarkIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No bookmarks yet</p>
                  <Link href="/bible">
                    <Button size="sm" className="mt-2 bg-[var(--scholar-gold)] text-black hover:bg-yellow-500">
                      Start Reading Scripture
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}