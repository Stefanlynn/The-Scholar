import { Link, useLocation } from "wouter";
import { BookOpen, Book, Library, FileText, MessageSquare, User, Settings } from "lucide-react";

const navigation = [
  { name: "The Scholar", href: "/", icon: MessageSquare },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Library", href: "/library", icon: Library },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Sermon Prep", href: "/sermon-prep", icon: BookOpen },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-[var(--scholar-dark)] border-r border-gray-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
            <Book className="text-black text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">The Scholar</h1>
            <p className="text-xs text-gray-400">Biblical Study Assistant</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`scholar-sidebar-item ${isActive ? 'active' : ''}`}>
                <Icon className="text-lg" />
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
              <User className="text-black text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Pastor John</p>
              <p className="text-xs text-gray-400">Premium Member</p>
            </div>
          </div>
          <button className="w-full text-xs text-gray-400 hover:text-white transition-colors flex items-center">
            <Settings className="mr-2 h-3 w-3" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
