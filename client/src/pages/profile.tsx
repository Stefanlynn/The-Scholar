import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
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
  Upload
} from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/profile"],
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
      location: formData.get("location") as string,
      website: formData.get("website") as string,
      phone: formData.get("phone") as string,
      ministryRole: formData.get("ministryRole") as string,
      defaultBibleTranslation: formData.get("defaultBibleTranslation") as string,
      darkMode: formData.get("darkMode") === "on",
      notifications: formData.get("notifications") === "on",
    };
    updateProfileMutation.mutate(data);
  };

  const uploadProfilePictureMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await apiRequest("POST", "/api/profile/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "Profile picture updated successfully!" });
      // Invalidate queries to refresh profile data everywhere
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to upload profile picture", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      uploadProfilePictureMutation.mutate(file);
    }
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
                      onClick={handleFileUpload}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                      disabled={uploadProfilePictureMutation.isPending}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {uploadProfilePictureMutation.isPending ? 'Uploading...' : 'Change Photo'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
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
                    <label className="text-white text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      name="phone"
                      defaultValue={profile?.phone || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Location</label>
                    <Input
                      name="location"
                      defaultValue={profile?.location || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Website</label>
                    <Input
                      name="website"
                      defaultValue={profile?.website || ""}
                      className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Ministry Role</label>
                    <Select name="ministryRole" defaultValue={profile?.ministryRole || ""}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pastor">Pastor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="leader">Ministry Leader</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Bio</label>
                  <Textarea
                    name="bio"
                    defaultValue={profile?.bio || ""}
                    className="bg-[var(--scholar-darker)] border-gray-600 text-white"
                    rows={3}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Preferences</h3>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Default Bible Translation</label>
                    <Select name="defaultBibleTranslation" defaultValue={profile?.defaultBibleTranslation || "NIV"}>
                      <SelectTrigger className="bg-[var(--scholar-darker)] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIV">NIV</SelectItem>
                        <SelectItem value="ESV">ESV</SelectItem>
                        <SelectItem value="KJV">KJV</SelectItem>
                        <SelectItem value="NASB">NASB</SelectItem>
                        <SelectItem value="NLT">NLT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Dark Mode</label>
                    <Switch name="darkMode" defaultChecked={profile?.darkMode ?? true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Notifications</label>
                    <Switch name="notifications" defaultChecked={profile?.notifications ?? true} />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    {profile?.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-400 text-xl md:text-2xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-semibold">
                      {profile?.fullName || user?.user_metadata?.full_name || "User"}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      {profile?.ministryRole || "Member"}
                    </p>
                    {profile?.isPremiumMember && (
                      <Badge className="mt-1 bg-[var(--scholar-gold)] text-black">Premium</Badge>
                    )}
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <h4 className="text-white font-medium mb-2">About</h4>
                    <p className="text-gray-300 text-sm">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {profile?.email && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Globe className="h-4 w-4" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--scholar-gold)]">
                        {profile.website}
                      </a>
                    </div>
                  )}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Bible Translation</p>
                <p className="text-gray-400 text-sm">{profile?.defaultBibleTranslation || "NIV"}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-gray-400 text-sm">{profile?.darkMode ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-gray-400 text-sm">{profile?.notifications ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}