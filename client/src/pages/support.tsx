import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageCircle, Mail } from "lucide-react";

export default function Support() {
  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
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
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Contact Support</h1>
              <p className="text-gray-400 text-sm">Get help or suggest new features</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                Have a question, need help, or want to suggest a feature?
              </p>

              <div className="space-y-6">
                <div className="bg-teal-600/20 rounded-lg p-6 border border-teal-600/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="text-teal-400 w-6 h-6" />
                    <h3 className="text-xl font-semibold text-white">Email Support</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      Email us at: <span className="text-teal-400 font-mono">support@thescholar.com</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      We typically respond within 1–2 business days.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => window.open('mailto:support@thescholar.com', '_blank')}
                    className="mt-4 bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}