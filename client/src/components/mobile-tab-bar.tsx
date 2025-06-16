import { Link, useLocation } from "wouter";
import { BookOpen, Book, Library, FileText, MessageSquare, User } from "lucide-react";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

const navigation = [
  { name: "Scholar", href: "/", icon: "logo", isLogo: true },
  { name: "Bible", href: "/bible", icon: Book, isLogo: false },
  { name: "Library", href: "/library", icon: Library, isLogo: false },
  { name: "Notes", href: "/notes", icon: FileText, isLogo: false },
  { name: "Profile", href: "/profile", icon: User, isLogo: false },
];

export default function MobileTabBar() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--scholar-dark)] border-t border-gray-800 p-2 z-50">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <button 
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  isActive ? 'text-[var(--scholar-gold)]' : 'text-gray-400'
                }`}
              >
                {item.isLogo ? (
                  <img 
                    src={scholarLogo} 
                    alt="The Scholar" 
                    className={`w-5 h-5 object-contain ${isActive ? 'brightness-0 saturate-100 hue-rotate-45' : 'brightness-0 opacity-60'}`}
                  />
                ) : (
                  <item.icon className="text-lg" />
                )}
                <span className="text-xs">{item.name}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
