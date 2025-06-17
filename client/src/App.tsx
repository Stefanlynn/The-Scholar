import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { ScrollToTop } from "@/hooks/use-scroll-to-top";
import LoadingPage from "@/components/loading-page";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import Home from "@/pages/home";
import Bible from "@/pages/bible";
import Library from "@/pages/library";
import Notes from "@/pages/notes";
import SermonPrep from "@/pages/sermon-prep";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Menu from "@/pages/menu";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Cookies from "@/pages/cookies";
import About from "@/pages/about";
import Support from "@/pages/support";
import DeleteAccount from "@/pages/delete-account";
import CommunityComingSoon from "@/pages/community-coming-soon";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function AuthenticatedApp() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [showLoadingPage, setShowLoadingPage] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Check if user is returning (has remember me set)
    const rememberMe = localStorage.getItem('scholar_remember_me');
    const expiry = localStorage.getItem('scholar_remember_expiry');
    
    if (rememberMe && expiry) {
      const isValid = Date.now() < parseInt(expiry);
      setIsReturningUser(isValid);
      
      // Clean up expired remember me
      if (!isValid) {
        localStorage.removeItem('scholar_remember_me');
        localStorage.removeItem('scholar_remember_expiry');
      }
    }
    
    // Show loading page for a brief moment to check sessions
    const timer = setTimeout(() => {
      setShowLoadingPage(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading page first
  if (showLoadingPage) {
    return (
      <LoadingPage 
        onComplete={() => setShowLoadingPage(false)}
        isReturningUser={isReturningUser}
      />
    );
  }

  // Check if user needs onboarding - only for truly new users
  const needsOnboarding = user && !user.user_metadata?.completed_onboarding && !isReturningUser;

  // Redirect to welcome if needed
  if (needsOnboarding && location !== "/welcome") {
    return <Welcome />;
  }

  return (
    <UserPreferencesProvider>
      <ScrollToTop />
      <Switch>
        <Route path="/welcome" component={Welcome} />
        <Route path="/" component={Home} />
        <Route path="/bible" component={Bible} />
        <Route path="/library" component={Library} />
        <Route path="/notes" component={Notes} />
        <Route path="/sermon-prep" component={SermonPrep} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/menu" component={Menu} />
        <Route path="/settings/privacy" component={Privacy} />
        <Route path="/settings/terms" component={Terms} />
        <Route path="/settings/cookies" component={Cookies} />
        <Route path="/settings/about" component={About} />
        <Route path="/settings/support" component={Support} />
        <Route path="/settings/delete-account" component={DeleteAccount} />
        <Route path="/community" component={CommunityComingSoon} />
      </Switch>
      <CookieConsentBanner />
    </UserPreferencesProvider>
  );
}

function Router() {
  const [location] = useLocation();

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
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route component={Login} /> {/* Default to login */}
      </Switch>
    </>
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
