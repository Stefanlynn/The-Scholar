import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import MobileNavMenu from "@/components/mobile-nav-menu";
import { 
  Shield, 
  FileText, 
  Cookie, 
  Info, 
  MessageCircle, 
  Trash2,
  ChevronRight,
  Settings as SettingsIcon
} from "lucide-react";

const settingsItems = [
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    icon: Shield,
    href: "/settings/privacy",
    color: "text-blue-500"
  },
  {
    title: "Terms of Use",
    description: "Guidelines and rules for using The Scholar",
    icon: FileText,
    href: "/settings/terms",
    color: "text-green-500"
  },
  {
    title: "Cookies",
    description: "How we use cookies to improve your experience",
    icon: Cookie,
    href: "/settings/cookies",
    color: "text-orange-500"
  },
  {
    title: "About The Scholar",
    description: "Learn more about our mission and features",
    icon: Info,
    href: "/settings/about",
    color: "text-purple-500"
  },
  {
    title: "Contact Support",
    description: "Get help or suggest new features",
    icon: MessageCircle,
    href: "/settings/support",
    color: "text-teal-500"
  },
  {
    title: "Delete My Account",
    description: "Permanently remove your account and data",
    icon: Trash2,
    href: "/settings/delete-account",
    color: "text-red-500"
  }
];

export default function Settings() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 text-sm">Manage your account and preferences</p>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <Link key={item.title} href={item.href}>
                  <Card className="bg-[var(--scholar-dark)] border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 group-hover:bg-gray-700 transition-colors`}>
                            <Icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-500 w-5 h-5 group-hover:text-gray-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <MobileNavMenu />
    </div>
  );
}