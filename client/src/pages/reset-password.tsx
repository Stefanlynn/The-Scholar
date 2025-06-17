import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { GraduationCap, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if we have the proper session for password reset
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Invalid or expired reset link. Please request a new password reset.");
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation("/login");
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--scholar-dark)] border-gray-800">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="text-white text-2xl" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Password Updated!</CardTitle>
              <CardDescription className="text-gray-400">
                Your password has been successfully updated. You'll be redirected to sign in shortly.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[var(--scholar-dark)] border-gray-800">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[var(--scholar-gold)] rounded-full flex items-center justify-center">
            <GraduationCap className="text-black text-2xl" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Set New Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your new password below
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white focus:border-[var(--scholar-gold)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-[var(--scholar-darker)] border-gray-700 text-white focus:border-[var(--scholar-gold)] pr-10"
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
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}