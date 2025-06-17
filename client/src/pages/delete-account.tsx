import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2, AlertTriangle, Mail } from "lucide-react";

export default function DeleteAccount() {
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
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Delete My Account</h1>
              <p className="text-gray-400 text-sm">Permanently remove your account and data</p>
            </div>
          </div>
        </div>

        {/* Warning Card */}
        <Card className="bg-red-600/20 border-red-600/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-400 w-6 h-6" />
              <h3 className="text-xl font-semibold text-white">Important Warning</h3>
            </div>
            <p className="text-red-200 leading-relaxed">
              This action is irreversible. Once deleted, your account and all associated data will be permanently removed and cannot be recovered.
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                We're sorry to see you go. To delete your account and all associated data:
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                    1
                  </div>
                  <p className="text-gray-300">Email support@thescholar.com</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                    2
                  </div>
                  <p className="text-gray-300">Use the subject line: <span className="text-red-400 font-mono">Delete My Account</span></p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                    3
                  </div>
                  <p className="text-gray-300">Include the email you used to sign up</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
                <p className="text-gray-300 text-sm">
                  We'll confirm and permanently delete your account within 7 days.
                </p>
                <p className="text-red-400 text-sm font-semibold mt-2">
                  Note: This action is irreversible.
                </p>
              </div>

              <Button 
                onClick={() => window.open('mailto:support@thescholar.com?subject=Delete My Account', '_blank')}
                className="mt-6 bg-red-600 text-white hover:bg-red-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Deletion Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}