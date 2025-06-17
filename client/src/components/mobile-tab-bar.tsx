import { Link, useLocation } from "wouter";
import { useState } from "react";
import { BookOpen, Book, Library, FileText, MessageSquare, User, GraduationCap, Settings, Menu, X, Share, Info, Users, Heart, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";
import type { User as UserType } from "@shared/schema";

const navigation = [
  { name: "Scholar", href: "/", icon: GraduationCap },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Library", href: "/library", icon: Library },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Menu", href: "/menu", icon: Menu },
];

const menuItems = [
  { name: "Share The Scholar", icon: Share, action: "share" },
  { name: "About", href: "/settings/about", icon: Info },
  { name: "Community", icon: Users, action: "community" },
  { name: "Donate", icon: Heart, action: "donate" },
  { name: "Help", icon: HelpCircle, action: "help" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileTabBar() {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  
  const { data: profile } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800/50 z-50">
      <div className="flex justify-around items-center px-2 py-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <button 
                className={`relative flex flex-col items-center p-2 transition-all duration-200 ${
                  isActive 
                    ? 'text-[var(--scholar-gold)]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-[var(--scholar-gold)] rounded-full"></div>
                )}
                
                {item.name === "Scholar" ? (
                  <img 
                    src={scholarLogo} 
                    alt="The Scholar" 
                    className={`w-5 h-5 object-contain transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  />
                ) : item.name === "Profile" && profile?.profilePicture ? (
                  <div className={`w-5 h-5 rounded-full overflow-hidden transition-all ${
                    isActive ? 'scale-110 ring-1 ring-[var(--scholar-gold)]' : 'scale-100'
                  }`}>
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <item.icon className={`w-5 h-5 transition-all ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`} />
                )}
                
                <span className={`text-[10px] mt-1 transition-all ${
                  isActive ? 'font-medium' : 'font-normal'
                }`}>
                  {item.name}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
