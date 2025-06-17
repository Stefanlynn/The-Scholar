import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, MessageCircle, BookOpen, Heart, Lightbulb } from "lucide-react";

export default function CommunityComingSoon() {
  return (
    <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Community Hub</h1>
              <p className="text-blue-400 text-sm font-medium">Coming Soon</p>
            </div>
          </div>
          <Link href="/menu">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>

        {/* Content */}
        <Card className="bg-[var(--scholar-dark)] border-gray-700">
          <CardContent className="p-6 md:p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                💬 Community Hub — Coming Soon
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                We're building something powerful.
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Soon, The Scholar will include a Community Page — a dedicated space where pastors, teachers, students, and spiritual leaders can connect, share, and grow together.
              </p>

              <p className="text-gray-300 leading-relaxed mb-6">
                This will be more than just a comment thread. It's a discipleship-driven environment designed for:
              </p>

              <div className="grid gap-4 my-8">
                <div className="flex items-start space-x-4 p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <MessageCircle className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Deep Conversations</h4>
                    <p className="text-gray-400 text-sm">Deep conversations around Scripture</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <Lightbulb className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Sermon Exchange</h4>
                    <p className="text-gray-400 text-sm">Sermon idea exchange and feedback</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <Heart className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Encouragement</h4>
                    <p className="text-gray-400 text-sm">Encouragement and testimonies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <BookOpen className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Group Studies</h4>
                    <p className="text-gray-400 text-sm">Group studies and discussion threads</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-[var(--scholar-darker)] rounded-lg">
                  <Users className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Leadership Insights</h4>
                    <p className="text-gray-400 text-sm">Leadership insight and teaching prompts</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Whether you're preparing a message or processing a tough question, you won't have to study alone.
              </p>

              <div className="text-center bg-gradient-to-r from-[var(--scholar-gold)]/10 to-purple-600/10 p-6 rounded-lg border border-[var(--scholar-gold)]/20">
                <p className="text-xl font-semibold text-white mb-2">
                  The Scholar Community
                </p>
                <p className="text-gray-300 mb-1">
                  Growing together in wisdom, truth, and grace.
                </p>
                <p className="text-[var(--scholar-gold)] font-medium">
                  Coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}