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
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                The Scholar is a digital companion for those called to rightly divide the Word of truth and lead others in it with clarity, confidence, and conviction.
              </p>

              <div className="text-center text-gray-500 text-xl font-light my-8">⸻</div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    To equip pastors, teachers, students, and spiritual leaders with powerful tools that make deep biblical study accessible, engaging, and Spirit-led.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Through intuitive technology and thoughtful design, The Scholar empowers users to:
                  </p>
                  <ul className="text-gray-300 space-y-3 ml-6 list-none">
                    <li>        •       Explore Scripture with AI-powered insight and biblical accuracy</li>
                    <li>        •       Dive deeper through original language studies, cultural context, and cross-references</li>
                    <li>        •       Build full sermons and devotionals with outlines, illustrations, and teaching frameworks</li>
                    <li>        •       Study and prepare in ways that stir both the mind and the heart</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We believe that timeless truth deserves modern tools.
                    The Scholar exists to bridge the gap between revelation and preparation—so that those called to teach, preach, and disciple can do so with excellence, depth, and a prophetic edge.
                  </p>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    This isn't just about learning the Bible. It's about becoming transformed by it—and helping others do the same.
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