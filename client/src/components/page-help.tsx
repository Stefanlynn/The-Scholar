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
        <DialogContent className="bg-[var(--scholar-dark)] border-[var(--scholar-gold)]/30 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[var(--scholar-gold)] text-xl font-semibold flex items-center">
              <HelpCircle className="h-6 w-6 mr-2" />
              {helpContent.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Page Overview */}
            <div className="p-4 bg-[var(--scholar-darker)] rounded-lg border border-[var(--scholar-gold)]/20">
              <p className="text-gray-200 leading-relaxed">
                {helpContent.description}
              </p>
            </div>

            {/* Features Guide */}
            <div className="space-y-4">
              <h3 className="text-[var(--scholar-gold)] font-semibold text-lg">Features & How to Use Them</h3>
              
              {helpContent.features.map((feature, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 bg-[var(--scholar-darker)]/50">
                  <h4 className="text-white font-medium mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.tips && feature.tips.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[var(--scholar-gold)] text-xs font-medium mb-1">💡 Tips:</p>
                      <ul className="text-gray-400 text-xs space-y-1">
                        {feature.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start">
                            <span className="text-[var(--scholar-gold)] mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Getting Started */}
            <div className="border-t border-[var(--scholar-gold)]/20 pt-4">
              <div className="bg-gradient-to-r from-[var(--scholar-gold)]/10 to-transparent rounded-lg p-4 border border-[var(--scholar-gold)]/20">
                <p className="text-[var(--scholar-gold)] font-medium text-sm mb-1">Getting Started</p>
                <p className="text-gray-200 text-sm">
                  Start exploring the features above! If you need help at any time, click the help button (?) in the page header.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}