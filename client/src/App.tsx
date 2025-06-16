import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Bible from "@/pages/bible";
import Library from "@/pages/library";
import Notes from "@/pages/notes";
import SermonPrep from "@/pages/sermon-prep";

function Router() {
  return (
    <Switch>
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
