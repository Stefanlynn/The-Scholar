import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, MessageSquare, ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/users/complete-onboarding", {});
    },
    onSuccess: () => {
      setLocation("/");
    },
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboardingMutation.mutate();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 mx-auto bg-[var(--scholar-gold)] rounded-full flex items-center justify-center">
              <GraduationCap className="text-black text-2xl" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome to The Scholar
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your personal companion for studying and communicating the Word of God.
              </p>
              <p className="text-base text-gray-400 max-w-2xl mx-auto">
                Whether you're a pastor, Bible teacher, or lifelong student of Scripture, 
                this space was created to help you grow deeper in truth, clarity, and spiritual insight.
              </p>
            </div>
            <Button 
              onClick={handleNext}
              className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-medium px-8 py-3 text-lg"
            >
              Continue
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center">
              <BookOpen className="text-white text-2xl" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                What You Can Do
              </h1>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-300 mb-6">
                  Inside The Scholar, you can:
                </p>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Study and explore Scripture with clarity</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Build sermons, devotionals, and teaching outlines</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Receive feedback on your message and delivery</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--scholar-gold)] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-300">Access tools for personal growth, preparation, and biblical understanding</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={handleNext}
              className="bg-green-600 text-white hover:bg-green-700 font-medium px-8 py-3 text-lg"
            >
              Next
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="text-white text-2xl" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Get Started
              </h1>
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-lg text-gray-300">
                  You're all set.
                </p>
                <p className="text-base text-gray-400">
                  Ask a question, explore a passage, or begin preparing your next message.
                </p>
                <p className="text-base text-gray-400">
                  The Scholar is here to help you study, reflect, and communicate the Word with confidence and depth.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleNext}
              disabled={completeOnboardingMutation.isPending}
              className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-8 py-3 text-lg flex items-center space-x-2"
            >
              <span>{completeOnboardingMutation.isPending ? "Loading..." : "Enter The Scholar"}</span>
              {!completeOnboardingMutation.isPending && <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--scholar-black)] flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-[var(--scholar-dark)] border-gray-800">
        <CardContent className="p-8 md:p-12">
          {renderStep()}
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-12 space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step === currentStep
                    ? currentStep === 1 
                      ? "bg-[var(--scholar-gold)]"
                      : currentStep === 2
                      ? "bg-green-600"
                      : "bg-blue-600"
                    : step < currentStep
                    ? "bg-gray-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}