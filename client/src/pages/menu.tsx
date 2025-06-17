import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import MobileNavMenu from "@/components/mobile-nav-menu";
import { 
  User, 
  Share, 
  Info, 
  Users, 
  Heart, 
  Settings,
  ArrowLeft
} from "lucide-react";

const menuItems = [
  { name: "Profile", icon: User, href: "/profile" },
  { name: "Share The Scholar", icon: Share, action: "share" },
  { name: "About", href: "/settings/about", icon: Info },
  { name: "Community", icon: Users, href: "/community" },
  { name: "Donate", icon: Heart, action: "donate" },
  { name: "Settings", href: "/settings", icon: Settings }
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
        window.open('https://discord.gg/thescholar', '_blank');
        break;
      case 'donate':
        window.open('https://buy.stripe.com/bJefZhf0Ab521kr8Mh0ZW00', '_blank');
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
              <h2 className="text-xl font-semibold text-white mb-3">Support The Scholar</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your donation helps us keep The Scholar free, build new tools for Bible study and sermon preparation, and empower pastors, teachers, and students around the world.
                Thank you for sowing into this Kingdom resource.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium px-6"
                  onClick={() => handleMenuAction('donate')}
                >
                  Make a Donation
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-gray-700/50"
                  onClick={() => handleMenuAction('share')}
                >
                  Share with Others
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => {
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