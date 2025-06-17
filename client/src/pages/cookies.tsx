import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { ChevronLeft, Cookie } from "lucide-react";

export default function Cookies() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 pb-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Cookie className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Cookies Policy</h1>
                <p className="text-gray-400 text-sm">How we use cookies to improve your experience</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <Card className="bg-[var(--scholar-dark)] border-gray-700">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  The Scholar uses cookies to improve your experience.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">What Are Cookies?</h3>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      Cookies are small files stored on your device that help us:
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Keep you logged in</li>
                      <li>• Remember your preferences</li>
                      <li>• Analyze performance and engagement</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Managing Cookies</h3>
                    <p className="text-gray-300 leading-relaxed">
                      You can disable cookies in your browser settings. This may affect some features of the app.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}