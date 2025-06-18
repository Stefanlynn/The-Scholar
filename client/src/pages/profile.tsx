import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Eye, EyeOff, Lock, Bell } from "lucide-react";
import type { User as UserType } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data: profile, isLoading } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update password", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "Please ensure both password fields match",
        variant: "destructive" 
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({ 
        title: "Password too short", 
        description: "Password must be at least 6 characters long",
        variant: "destructive" 
      });
      return;
    }
    
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--scholar-black)] text-white p-4 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--scholar-gold)] flex items-center">
              <User className="h-7 w-7 mr-3" />
              Profile
            </h1>
            <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="bg-[var(--scholar-darker)] border-[var(--scholar-gold)]/20">
          <CardHeader>
            <CardTitle className="text-[var(--scholar-gold)] flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <Input
                  value={profile?.fullName || ""}
                  disabled
                  className="bg-[var(--scholar-dark)] border-gray-600 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-[var(--scholar-dark)] border-gray-600 text-gray-300"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className="bg-[var(--scholar-darker)] border-[var(--scholar-gold)]/20">
          <CardHeader>
            <CardTitle className="text-[var(--scholar-gold)] flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Password & Security
              </div>
              {!showPasswordForm && (
                <Button
                  onClick={() => setShowPasswordForm(true)}
                  variant="outline"
                  size="sm"
                  className="border-[var(--scholar-gold)] text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)] hover:text-black"
                >
                  Change Password
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showPasswordForm ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[var(--scholar-dark)] border-gray-600 text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[var(--scholar-dark)] border-gray-600 text-white pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[var(--scholar-dark)] border-gray-600 text-white pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500"
                  >
                    {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400">Password was last updated recently. Click "Change Password" to update it.</p>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-[var(--scholar-darker)] border-[var(--scholar-gold)]/20">
          <CardHeader>
            <CardTitle className="text-[var(--scholar-gold)] flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Bible Translation */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Default Bible Translation</h3>
                <p className="text-sm text-gray-400">Choose your preferred Bible translation for study</p>
              </div>
              <Select 
                value={preferences.defaultBibleTranslation} 
                onValueChange={(value) => updatePreferences({ defaultBibleTranslation: value })}
              >
                <SelectTrigger className="w-32 bg-[var(--scholar-dark)] border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KJV">KJV</SelectItem>
                  <SelectItem value="NIV">NIV</SelectItem>
                  <SelectItem value="ESV">ESV</SelectItem>
                  <SelectItem value="NASB">NASB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-700" />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Dark Mode</h3>
                <p className="text-sm text-gray-400">Toggle between light and dark theme</p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => updatePreferences({ darkMode: checked })}
              />
            </div>

            <Separator className="bg-gray-700" />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Notifications</h3>
                <p className="text-sm text-gray-400">Receive updates and reminders</p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(checked) => updatePreferences({ notifications: checked })}
              />
            </div>

            <Separator className="bg-gray-700" />

            {/* Sign Out */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Sign Out</h3>
                <p className="text-sm text-gray-400">Sign out of your Scholar account</p>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}