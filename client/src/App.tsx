import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import Bible from "@/pages/bible";
import Library from "@/pages/library";
import Notes from "@/pages/notes";
import SermonPrep from "@/pages/sermon-prep";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function AuthenticatedApp() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Check if user needs onboarding (you can implement this logic based on user metadata)
  const needsOnboarding = user && !user.user_metadata?.completed_onboarding;

  // If user needs onboarding and not on welcome page, show welcome
  if (needsOnboarding && location !== "/welcome") {
    return <Welcome />;
  }

  // If user completed onboarding and on welcome page, redirect to home
  if (user && !needsOnboarding && location === "/welcome") {
    return <Home />;
  }

  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <Route path="/" component={Home} />
      <Route path="/bible" component={Bible} />
      <Route path="/library" component={Library} />
      <Route path="/notes" component={Notes} />
      <Route path="/sermon-prep" component={SermonPrep} />
    </Switch>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show auth pages
  if (!user) {
    return (
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route component={Login} /> {/* Default to login */}
      </Switch>
    );
  }

  // User is authenticated, show the main app
  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="bg-[var(--scholar-black)] text-white min-h-screen">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
