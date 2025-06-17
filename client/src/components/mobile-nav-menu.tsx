import { Link, useLocation } from "wouter";
import { Book, Library, FileText, GraduationCap, Menu } from "lucide-react";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

const navigation = [
  { name: "Scholar", href: "/", icon: GraduationCap },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Library", href: "/library", icon: Library },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Menu", href: "/menu", icon: Menu },
];

export default function MobileNavMenu() {
  const [location] = useLocation();

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
  );
}