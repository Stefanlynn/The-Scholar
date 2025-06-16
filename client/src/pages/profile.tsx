import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/sidebar";
import MobileTabBar from "@/components/mobile-tab-bar";
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
  Edit, 
  Save, 
  Camera, 
  BookOpen, 
  FileText, 
  MessageSquare,
  LogOut,
  Trash2,
  Shield
} from "lucide-react";
import type { User as UserType, UpdateUserProfile } from "@shared/schema";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const { data: stats } = useQuery<{notes: number, sermons: number, bookmarks: number}>({
    queryKey: ["/api/profile/stats"],
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      return apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      // Invalidate all user-related queries to refresh data across the entire app
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/profile");
    },
    onSuccess: () => {
      toast({ title: "Account deleted successfully" });
      signOut();
    },
    onError: () => {
      toast({ title: "Failed to delete account", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateUserProfile = {
      fullName: formData.get("fullName") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      ministryRole: formData.get("ministryRole") as string || undefined,
      defaultBibleTranslation: formData.get("translation") as string || undefined,
      darkMode: formData.get("darkMode") === "on",
      notifications: formData.get("notifications") === "on",
    };
    updateProfileMutation.mutate(data);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading profile...</div>
        </div>
        <MobileTabBar />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--scholar-dark)] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6 space-y-6">
          
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
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-white">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <Input
                        name="fullName"
                        defaultValue={profile?.fullName || ""}
                        className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <Input
                        value={profile?.email || ""}
                        disabled
                        className="bg-gray-800 border-gray-600 text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ministry Role
                    </label>
                    <Select name="ministryRole" defaultValue={profile?.ministryRole || ""}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue placeholder="Select your ministry role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                        <SelectItem value="pastor">Pastor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="worship-leader">Worship Leader</SelectItem>
                        <SelectItem value="youth-pastor">Youth Pastor</SelectItem>
                        <SelectItem value="evangelist">Evangelist</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <Textarea
                      name="bio"
                      defaultValue={profile?.bio || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                      placeholder="Tell us about yourself and your ministry..."
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                      {profile?.profilePicture ? (
                        <img 
                          src={profile.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {profile?.fullName || "No name set"}
                      </h3>
                      <p className="text-gray-400">{profile?.email}</p>
                      {profile?.ministryRole && (
                        <Badge variant="outline" className="mt-1 text-[var(--scholar-gold)] border-[var(--scholar-gold)]/30">
                          {profile.ministryRole.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {profile?.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">About</h4>
                      <p className="text-gray-200">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Default Bible Translation</label>
                  <p className="text-gray-400 text-sm">Choose your preferred Bible version</p>
                </div>
                <Select defaultValue={profile?.defaultBibleTranslation || "NIV"}>
                  <SelectTrigger className="w-32 bg-[var(--scholar-darker)] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--scholar-darker)] border-gray-600">
                    <SelectItem value="NIV">NIV</SelectItem>
                    <SelectItem value="ESV">ESV</SelectItem>
                    <SelectItem value="NASB">NASB</SelectItem>
                    <SelectItem value="KJV">KJV</SelectItem>
                    <SelectItem value="NKJV">NKJV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Dark Mode</label>
                  <p className="text-gray-400 text-sm">Use dark theme throughout the app</p>
                </div>
                <Switch 
                  defaultChecked={profile?.darkMode !== false}
                  className="data-[state=checked]:bg-[var(--scholar-gold)]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Notifications</label>
                  <p className="text-gray-400 text-sm">Receive study reminders and updates</p>
                </div>
                <Switch 
                  defaultChecked={profile?.notifications !== false}
                  className="data-[state=checked]:bg-[var(--scholar-gold)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <FileText className="h-8 w-8 text-[var(--scholar-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats?.notes ?? 0}</div>
                  <div className="text-gray-400 text-sm">Study Notes</div>
                </div>
                
                <div className="text-center p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <MessageSquare className="h-8 w-8 text-[var(--scholar-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats?.sermons ?? 0}</div>
                  <div className="text-gray-400 text-sm">Sermon Drafts</div>
                </div>
                
                <div className="text-center p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <BookOpen className="h-8 w-8 text-[var(--scholar-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stats?.bookmarks ?? 0}</div>
                  <div className="text-gray-400 text-sm">Bookmarks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[var(--scholar-darker)] border border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <LogOut className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-white font-medium">Sign Out</div>
                      <div className="text-gray-400 text-sm">End your current session</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Sign Out
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--scholar-darker)] border border-red-900/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="text-white font-medium">Delete Account</div>
                      <div className="text-gray-400 text-sm">Permanently remove your account and all data</div>
                    </div>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[var(--scholar-dark)] border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-red-400">Delete Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          This action cannot be undone. This will permanently delete your account 
                          and remove all your data including notes, sermons, and bookmarks.
                        </p>
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => setShowDeleteDialog(false)}
                            variant="outline"
                            className="flex-1 border-gray-600 text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => deleteAccountMutation.mutate()}
                            className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            disabled={deleteAccountMutation.isPending}
                          >
                            Delete Forever
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}