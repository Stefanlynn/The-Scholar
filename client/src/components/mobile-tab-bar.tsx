import { Link, useLocation } from "wouter";
import { BookOpen, Book, Library, FileText, MessageSquare, User } from "lucide-react";

const navigation = [
  { name: "Scholar", href: "/", icon: MessageSquare },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Library", href: "/library", icon: Library },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileTabBar() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--scholar-dark)] border-t border-gray-800 p-2 z-50">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <button 
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  isActive ? 'text-[var(--scholar-gold)]' : 'text-gray-400'
                }`}
              >
                <Icon className="text-lg" />
                <span className="text-xs">{item.name}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
