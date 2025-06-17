import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password, rememberMe);
    
    if (error) {
      setError(error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[var(--scholar-dark)] border-gray-800">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[var(--scholar-gold)] rounded-full flex items-center justify-center">
            <GraduationCap className="text-black text-2xl" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your Scholar account
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
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[var(--scholar-darker)] border-gray-700 text-white focus:border-[var(--scholar-gold)]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-[var(--scholar-gold)] data-[state=checked]:border-[var(--scholar-gold)]"
              />
              <Label htmlFor="remember-me" className="text-gray-300 text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[var(--scholar-gold)] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}