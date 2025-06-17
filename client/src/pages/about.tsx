import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info } from "lucide-react";

export default function About() {
  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Info className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">About The Scholar</h1>
              <p className="text-purple-400 text-sm font-medium">Learn more about our mission and features</p>
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
                The Scholar is a digital tool for those called to rightly divide the Word of truth.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Built for pastors, teachers, students, and spiritual leaders, The Scholar offers:
                  </p>
                  <ul className="text-gray-300 space-y-2 mt-3">
                    <li>• AI-powered study and interpretation tools</li>
                    <li>• Deep-dive features like Greek/Hebrew word studies, sermon builders, and cultural context</li>
                    <li>• Devotional and teaching resources curated for impact</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We believe that combining timeless truth with modern tools can transform how we engage Scripture.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}