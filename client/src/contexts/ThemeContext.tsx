import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { User as UserType } from "@shared/schema";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  // Get user profile to sync with darkMode preference
  const { data: profile } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  useEffect(() => {
    // Sync with user profile dark mode preference
    if (profile?.darkMode !== undefined) {
      const userTheme = profile.darkMode ? "dark" : "light";
      setThemeState(userTheme);
    } else {
      // Check localStorage for saved theme
      const savedTheme = localStorage.getItem("scholar-theme") as "light" | "dark" | null;
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        // Default to dark theme for The Scholar
        setThemeState("dark");
      }
    }
  }, [profile?.darkMode]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save theme to localStorage
    localStorage.setItem("scholar-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === "light" ? "dark" : "light");
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}