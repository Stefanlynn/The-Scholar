import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import Home from "@/pages/home";
import Bible from "@/pages/bible";
import Library from "@/pages/library";
import Notes from "@/pages/notes";
import SermonPrep from "@/pages/sermon-prep";
import Profile from "@/pages/profile";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function AuthenticatedApp() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Check if user needs onboarding
  const needsOnboarding = user && !user.user_metadata?.completed_onboarding;

  // Redirect to welcome if needed
  if (needsOnboarding && location !== "/welcome") {
    return <Welcome />;
  }

  return (
    <UserPreferencesProvider>
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={Home} />
        <Route path="/bible" component={Bible} />
        <Route path="/library" component={Library} />
        <Route path="/notes" component={Notes} />
        <Route path="/sermon-prep" component={SermonPrep} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </UserPreferencesProvider>
  );
}

function Router() {
  const [location] = useLocation();

  // Check for development bypass
  const skipAuth = localStorage.getItem('skipAuth') === 'true';

  // Development bypass - go directly to main app
  if (skipAuth) {
    return <AuthenticatedApp />;
  }

  // Try to get auth context, but don't break if it fails
  let user = null;
  let loading = false;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
  } catch (error) {
    // AuthContext not available, show login
    return (
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, show the main app
  if (user) {
    return <AuthenticatedApp />;
  }

  // If user is not authenticated, show auth pages
  return (
    <Switch>
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route component={Login} /> {/* Default to login */}
    </Switch>
  );
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
