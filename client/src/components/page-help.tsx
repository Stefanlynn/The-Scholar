import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";

interface PageHelpProps {
  pageName: string;
  helpContent: {
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      tips?: string[];
    }>;
  };
}

export default function PageHelp({ pageName, helpContent }: PageHelpProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowHelp(true)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-[var(--scholar-gold)] hover:bg-[var(--scholar-gold)]/10"
        title={`Help for ${pageName}`}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/30 text-white max-w-md w-[90vw] max-h-[70vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-[var(--scholar-gold)] text-lg font-semibold flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              {helpContent.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Page Overview */}
            <div className="p-3 bg-[var(--scholar-darker)] rounded border border-[var(--scholar-gold)]/20">
              <p className="text-gray-200 text-sm leading-relaxed">
                {helpContent.description}
              </p>
            </div>

            {/* Compact Features Guide */}
            <div className="space-y-3">
              <h3 className="text-[var(--scholar-gold)] font-medium text-sm">Key Features</h3>
              
              {helpContent.features.map((feature, index) => (
                <div key={index} className="border border-gray-700 rounded p-3 bg-[var(--scholar-darker)]/30">
                  <h4 className="text-white font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-gray-300 text-xs mb-2 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.tips && feature.tips.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[var(--scholar-gold)] text-xs font-medium mb-1">Tips:</p>
                      <ul className="text-gray-400 text-xs space-y-0.5">
                        {feature.tips.slice(0, 3).map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start">
                            <span className="text-[var(--scholar-gold)] mr-1 text-xs">•</span>
                            <span className="text-xs">{tip}</span>
                          </li>
                        ))}
                        {feature.tips.length > 3 && (
                          <li className="text-gray-500 text-xs italic">...and more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Compact Getting Started */}
            <div className="border-t border-[var(--scholar-gold)]/20 pt-3">
              <div className="bg-gradient-to-r from-[var(--scholar-gold)]/10 to-transparent rounded p-3 border border-[var(--scholar-gold)]/20">
                <p className="text-[var(--scholar-gold)] font-medium text-xs mb-1">Quick Start</p>
                <p className="text-gray-200 text-xs">
                  Try the features above! Click the help button (?) anytime for guidance.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}