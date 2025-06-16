import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Bible from "@/pages/bible";
import Library from "@/pages/library";
import Notes from "@/pages/notes";
import SermonPrep from "@/pages/sermon-prep";
import Welcome from "@/pages/welcome";

interface User {
  id: number;
  username: string;
  hasCompletedOnboarding: boolean;
}

function Router() {
  const [location] = useLocation();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });

  // Show loading while checking user status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If user hasn't completed onboarding and not on welcome page, redirect to welcome
  if (user && !user.hasCompletedOnboarding && location !== "/welcome") {
    return <Welcome />;
  }

  // If user has completed onboarding and on welcome page, redirect to home
  if (user && user.hasCompletedOnboarding && location === "/welcome") {
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-[var(--scholar-black)] text-white min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
