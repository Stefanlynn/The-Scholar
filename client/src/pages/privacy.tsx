import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      
      <div className="flex-1 p-4 md:p-6 pb-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-blue-400 text-sm font-medium">Effective Date: 2025</p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
          </div>

        {/* Content */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                Welcome to The Scholar. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app and website.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Name and email address (when you sign up)</li>
                    <li>• Notes, study preferences, and saved content</li>
                    <li>• Chat history with the Scholar assistant</li>
                    <li>• Device data (IP address, browser type, usage patterns)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Data</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• To personalize your Bible study and teaching experience</li>
                    <li>• To improve the app and user interface</li>
                    <li>• To respond to support requests</li>
                    <li>• To send optional updates or devotionals</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. AI Interaction</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your interactions with the Scholar are private. We do not store permanent records of chats unless you choose to save them.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Sharing Information</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We do not sell your personal information. We work only with secure third-party tools (e.g. Supabase, Gemini, Bible APIs) to deliver core features.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Your Rights</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You may request to view, edit, or delete your data by emailing support@thescholar.com.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">6. Changes</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We may occasionally update this policy. Continued use implies acceptance of any future revisions.
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