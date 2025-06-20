import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--scholar-black)]">
      
      <div className="flex-1 p-4 md:p-6 pb-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Terms of Use</h1>
                <p className="text-green-400 text-sm font-medium">Last Updated: 2025</p>
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
                By using The Scholar, you agree to the following terms:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Eligibility</h3>
                  <p className="text-gray-300 leading-relaxed">
                    You must be 13 or older to use this app.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Usage Guidelines</h3>
                  <p className="text-gray-300 leading-relaxed mb-3">You agree not to:</p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Use the app to spread harmful or false information</li>
                    <li>• Misuse AI tools for unethical purposes</li>
                    <li>• Upload illegal, offensive, or plagiarized content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Content Ownership</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Content generated through The Scholar (e.g., notes, outlines, sermons) is yours to use for educational and ministry purposes. The AI responses are for personal use and not to be resold.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Disclaimers</h3>
                  <p className="text-gray-300 leading-relaxed">
                    The Scholar is a study tool. It is not a replacement for your own spiritual discernment, pastoral oversight, or theological education.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We are not responsible for decisions made based on the information or responses provided by this app.
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