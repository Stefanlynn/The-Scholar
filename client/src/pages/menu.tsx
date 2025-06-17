import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import MobileNavMenu from "@/components/mobile-nav-menu";
import { 
  Share, 
  Info, 
  Users, 
  Heart, 
  HelpCircle, 
  Settings,
  ChevronRight,
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

const menuItems = [
  { 
    name: "Share The Scholar", 
    icon: Share, 
    description: "Tell others about this biblical study tool",
    action: "share" 
  },
  { 
    name: "About", 
    href: "/settings/about", 
    icon: Info,
    description: "Learn about our mission and features"
  },
  { 
    name: "Community", 
    icon: Users, 
    description: "Connect with other biblical scholars",
    action: "community" 
  },
  { 
    name: "Donate", 
    icon: Heart, 
    description: "Support The Scholar's development",
    action: "donate" 
  },
  { 
    name: "Help", 
    icon: HelpCircle, 
    description: "Get help and learn how to use features",
    action: "help" 
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    description: "Manage your account and preferences"
  },
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
          <div className="text-center space-y-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--scholar-gold)] to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={scholarLogo} alt="The Scholar" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">More</h1>
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-[var(--scholar-gold)]/10 to-[var(--scholar-gold)]/5 border-[var(--scholar-gold)]/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-3">Access the Full Experience</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Discover powerful biblical study tools, connect with community features, and 
                  customize your experience. Everything you need for deeper Scripture engagement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/settings">
                    <Button className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium">
                      Manage Settings
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => handleMenuAction('help')}
                  >
                    Get Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              if (item.href) {
                return (
                  <Link key={item.name} href={item.href}>
                    <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
                              <Icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-1">{item.name}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-500 w-5 h-5 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
              
              return (
                <Card 
                  key={item.name} 
                  className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleMenuAction(item.action!)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{item.name}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-500 w-5 h-5 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
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