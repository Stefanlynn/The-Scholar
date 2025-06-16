import { Search, Bookmark, History, Lightbulb } from "lucide-react";

export default function QuickAccess() {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <div className="bg-[var(--scholar-dark)] glass-effect border border-gray-700 rounded-lg p-4 shadow-2xl">
        <h4 className="text-[var(--scholar-gold)] font-medium mb-3 text-sm">Quick Access</h4>
        <div className="space-y-2">
          <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-[var(--scholar-darker)] transition-colors">
            <Search className="w-4 h-4" />
            <span>Search Bible</span>
          </button>
          <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-[var(--scholar-darker)] transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>Bookmarks</span>
          </button>
          <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-[var(--scholar-darker)] transition-colors">
            <History className="w-4 h-4" />
            <span>Recent</span>
          </button>
          <button className="w-full text-left flex items-center space-x-2 text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-[var(--scholar-darker)] transition-colors">
            <Lightbulb className="w-4 h-4" />
            <span>Study Tools</span>
          </button>
        </div>
      </div>
    </div>
  );
}
