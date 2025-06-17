import { Link, useLocation } from "wouter";
import { BookOpen, Book, Library, FileText, MessageSquare, User, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";
import type { User as UserType } from "@shared/schema";

const navigation = [
  { name: "The Scholar", href: "/", icon: MessageSquare },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Library", href: "/library", icon: Library },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const { data: profile } = useQuery<UserType>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  return (
    <div className="w-64 bg-[var(--scholar-dark)] border-r border-gray-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">
            <img 
              src={scholarLogo} 
              alt="The Scholar" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">The Scholar</h1>
            <p className="text-xs text-gray-400">Biblical Study Tool</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div 
                className={`scholar-sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {item.name === "The Scholar" ? (
                  <img 
                    src={scholarLogo} 
                    alt="The Scholar" 
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <Icon className="text-lg" />
                )}
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="bg-[var(--scholar-darker)] rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-black text-sm" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {profile?.fullName || user?.user_metadata?.full_name || "User"}
              </p>
              {profile?.isPremiumMember ? (
                <p className="text-xs text-gray-400">Premium Member</p>
              ) : (
                <p className="text-xs text-gray-400">Free Account</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
