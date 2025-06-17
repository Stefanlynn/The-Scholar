import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Cookie, Settings } from "lucide-react";
import { 
  getCookieConsent, 
  setCookieConsent, 
  shouldShowCookieBanner,
  COOKIE_CATEGORIES,
  type CookieConsent 
} from "@/lib/cookies";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(getCookieConsent());

  useEffect(() => {
    setShowBanner(shouldShowCookieBanner());
  }, []);

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookieConsent(fullConsent);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookieConsent(necessaryOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setCookieConsent(consent);
    setShowBanner(false);
  };

  const handleConsentChange = (type: keyof CookieConsent, value: boolean) => {
    if (type === 'necessary') return; // Necessary cookies can't be disabled
    
    setConsent(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-[var(--scholar-black)] border-[var(--scholar-gold)] border-2 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-[var(--scholar-gold)] mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Cookie Preferences
              </h3>
              
              {!showDetails ? (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    The Scholar uses cookies to enhance your biblical study experience. 
                    We use necessary cookies for authentication and optional cookies to 
                    remember your preferences and improve the app.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={handleAcceptAll}
                      className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-semibold"
                    >
                      Accept All
                    </Button>
                    <Button 
                      onClick={handleAcceptNecessary}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Necessary Only
                    </Button>
                    <Button 
                      onClick={() => setShowDetails(true)}
                      variant="ghost"
                      className="text-[var(--scholar-gold)] hover:bg-gray-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-300 text-sm">
                    Choose which cookies you want to allow. Necessary cookies are required for basic functionality.
                  </p>
                  
                  <div className="space-y-4">
                    {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                      <div key={key} className="flex items-start justify-between p-3 bg-gray-900 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-white">{category.name}</h4>
                            <Switch
                              checked={consent[key as keyof CookieConsent]}
                              onCheckedChange={(value) => handleConsentChange(key as keyof CookieConsent, value)}
                              disabled={key === 'necessary'}
                              className="data-[state=checked]:bg-[var(--scholar-gold)]"
                            />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {category.description}
                          </p>
                          {category.cookies.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {category.cookies.map((cookie, index) => (
                                <div key={index} className="mb-1">
                                  <strong>{cookie.name}:</strong> {cookie.purpose}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSavePreferences}
                      className="bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-semibold"
                    >
                      Save Preferences
                    </Button>
                    <Button 
                      onClick={() => setShowDetails(false)}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleAcceptNecessary}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}