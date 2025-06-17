import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import MobileNavMenu from "@/components/mobile-nav-menu";
import { 
  Bookmark, 
  Users, 
  Eye, 
  MapPin, 
  Sun, 
  Headphones, 
  Play, 
  Award, 
  Zap, 
  Settings,
  ArrowLeft
} from "lucide-react";

const menuSections = [
  {
    items: [
      { name: "Saved", icon: Bookmark, href: "/notes" },
      { name: "Add Friends", icon: Users, action: "friends" },
      { name: "Following", icon: Eye, action: "following" },
      { name: "Events", icon: MapPin, action: "events" }
    ]
  },
  {
    items: [
      { name: "Verse of the Day", icon: Sun, action: "verse" },
      { name: "Prayer", icon: Headphones, action: "prayer" },
      { name: "Videos", icon: Play, action: "videos" }
    ]
  },
  {
    items: [
      { name: "Badges", icon: Award, action: "badges" },
      { name: "Bible App Activity", icon: Zap, action: "activity" }
    ]
  }
];

export default function Menu() {
  const handleMenuAction = (action: string) => {
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
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">More</h1>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Access the Full Experience</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Create a free account to add friends, access thousands of 
                devotionals, sync highlights, and download Bibles to read offline. No 
                ads, paywalls, or purchases—ever!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/settings">
                  <Button className="bg-white text-black hover:bg-gray-100 font-medium px-6">
                    Create Account
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-gray-700/50"
                  onClick={() => handleMenuAction('help')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.href) {
                    return (
                      <Link key={item.name} href={item.href}>
                        <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                          <Icon className="w-6 h-6 text-gray-400" />
                          <span className="text-white font-medium">{item.name}</span>
                        </div>
                      </Link>
                    );
                  }
                  
                  return (
                    <div 
                      key={item.name} 
                      className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => handleMenuAction(item.action!)}
                    >
                      <Icon className="w-6 h-6 text-gray-400" />
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Back Navigation */}
          <div className="pt-6">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to The Scholar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <MobileNavMenu />
    </div>
  );
}