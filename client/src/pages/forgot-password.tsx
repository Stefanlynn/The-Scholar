import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await resetPassword(email);
    
    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      setSuccess(result.message);
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
            <CardTitle className="text-2xl font-bold text-white">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <Mail className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                {success}. Please check your email for further instructions.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[var(--scholar-darker)] border-gray-700 text-white focus:border-[var(--scholar-gold)]"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <Link href="/login" className="inline-flex items-center text-[var(--scholar-gold)] hover:underline text-sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
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