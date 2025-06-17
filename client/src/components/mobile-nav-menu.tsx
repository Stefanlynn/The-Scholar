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
  { name: "Menu", href: "#", icon: Menu, isMenu: true },
];

const menuItems = [
  { name: "Share The Scholar", icon: Share, action: "share" },
  { name: "About", href: "/settings/about", icon: Info },
  { name: "Community", icon: Users, action: "community" },
  { name: "Donate", icon: Heart, action: "donate" },
  { name: "Help", icon: HelpCircle, action: "help" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNavMenu() {
  const [location] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  
  const { data: profile } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'The Scholar - Biblical Study Assistant',
            text: 'Check out this amazing biblical study app!',
            url: window.location.origin
          });
        } else {
          navigator.clipboard.writeText(window.location.origin);
        }
        break;
      case 'community':
        // Add community action here
        break;
      case 'donate':
        // Add donate action here  
        break;
      case 'help':
        // Add help action here
        break;
    }
  };

  return (
    <>
      {/* Menu Overlay */}
      {showMenu && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMenu(false)}
        >
          <Card className="fixed bottom-20 left-4 right-4 bg-[var(--scholar-dark)] border-gray-700 z-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Menu</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowMenu(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.href) {
                    return (
                      <Link key={item.name} href={item.href}>
                        <button 
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                          onClick={() => setShowMenu(false)}
                        >
                          <Icon className="w-5 h-5 text-gray-400" />
                          <span className="text-white">{item.name}</span>
                        </button>
                      </Link>
                    );
                  }
                  
                  return (
                    <button 
                      key={item.name}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                      onClick={() => handleMenuAction(item.action!)}
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800/50 z-50">
        <div className="flex justify-around items-center px-2 py-1">
          {navigation.map((item) => {
            const isActive = location === item.href && !item.isMenu;
            
            if (item.isMenu) {
              return (
                <button 
                  key={item.name}
                  className={`relative flex flex-col items-center p-2 transition-all duration-200 ${
                    showMenu 
                      ? 'text-[var(--scholar-gold)]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  onClick={() => setShowMenu(!showMenu)}
                >
                  {showMenu && (
                    <div className="absolute -top-1 w-1 h-1 bg-[var(--scholar-gold)] rounded-full"></div>
                  )}
                  
                  <item.icon className={`w-5 h-5 transition-all ${
                    showMenu ? 'scale-110' : 'scale-100'
                  }`} />
                  
                  <span className={`text-[10px] mt-1 transition-all ${
                    showMenu ? 'text-[var(--scholar-gold)] font-medium scale-105' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                </button>
              );
            }
            
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
                  ) : (
                    <item.icon className={`w-5 h-5 transition-all ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`} />
                  )}
                  
                  <span className={`text-[10px] mt-1 transition-all ${
                    isActive ? 'text-[var(--scholar-gold)] font-medium scale-105' : 'text-gray-500'
                  }`}>
                    {item.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}