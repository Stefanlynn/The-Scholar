// Cookie management utility for The Scholar app
// Handles authentication, preferences, and user experience cookies

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const COOKIE_CONSENT_KEY = 'scholar_cookie_consent';
export const COOKIE_BANNER_DISMISSED = 'scholar_cookie_banner_dismissed';

// Default consent settings (necessary cookies are always required)
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,     // Authentication, security, remember me
  functional: true,    // User preferences, settings, language
  analytics: false,    // Usage analytics (if implemented)
  marketing: false     // Marketing cookies (currently not used)
};

// Get current cookie consent settings
export function getCookieConsent(): CookieConsent {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const consent = JSON.parse(stored);
      // Ensure necessary cookies are always enabled
      return { ...consent, necessary: true };
    }
  } catch (error) {
    console.warn('Failed to parse cookie consent:', error);
  }
  
  return DEFAULT_CONSENT;
}

// Save cookie consent settings
export function setCookieConsent(consent: CookieConsent): void {
  // Necessary cookies must always be enabled
  const finalConsent = { ...consent, necessary: true };
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(finalConsent));
  localStorage.setItem(COOKIE_BANNER_DISMISSED, 'true');
  
  // Clean up cookies based on consent
  cleanupCookiesBasedOnConsent(finalConsent);
}

// Check if cookie banner should be shown
export function shouldShowCookieBanner(): boolean {
  const dismissed = localStorage.getItem(COOKIE_BANNER_DISMISSED);
  const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  
  return !dismissed && !hasConsent;
}

// Clean up cookies that user hasn't consented to
function cleanupCookiesBasedOnConsent(consent: CookieConsent): void {
  // If functional cookies are disabled, remove preference cookies
  if (!consent.functional) {
    // Remove non-essential functional cookies (keep auth-related ones)
    const keysToRemove = [
      'scholar_tutorial_completed',
      'scholar_last_bible_chapter',
      'scholar_preferred_translation'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  // If analytics disabled, remove any analytics cookies
  if (!consent.analytics) {
    // Remove analytics cookies (currently none, but future-proofing)
    const analyticsKeys = [
      'scholar_analytics_id',
      'scholar_session_tracking'
    ];
    
    analyticsKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  // Marketing cookies cleanup (currently none used)
  if (!consent.marketing) {
    // Future marketing cookie cleanup would go here
  }
}

// Cookie categories and their purposes
export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Necessary Cookies',
    description: 'Essential for authentication, security, and core app functionality',
    cookies: [
      {
        name: 'Supabase Auth Token',
        purpose: 'Maintains your login session securely',
        duration: 'Session or 30 days (if "Remember me" is selected)'
      },
      {
        name: 'Remember Me Token',
        purpose: 'Remembers your login preference for 30 days',
        duration: '30 days'
      }
    ]
  },
  functional: {
    name: 'Functional Cookies',
    description: 'Enhance your experience by remembering your preferences',
    cookies: [
      {
        name: 'User Preferences',
        purpose: 'Stores your Bible translation, theme, and settings',
        duration: 'Until you clear browser data'
      },
      {
        name: 'Tutorial Progress',
        purpose: 'Remembers if you\'ve completed the app tutorial',
        duration: 'Permanent'
      }
    ]
  },
  analytics: {
    name: 'Analytics Cookies',
    description: 'Help us understand how the app is used to improve it',
    cookies: [
      {
        name: 'Usage Analytics',
        purpose: 'Anonymous usage statistics to improve the app',
        duration: '1 year'
      }
    ]
  },
  marketing: {
    name: 'Marketing Cookies',
    description: 'Currently not used by The Scholar',
    cookies: []
  }
};

// Check if a specific cookie type is allowed
export function isCookieTypeAllowed(type: keyof CookieConsent): boolean {
  const consent = getCookieConsent();
  return consent[type];
}

// Set a cookie only if user has consented to that type
export function setConsentedCookie(key: string, value: string, type: keyof CookieConsent): void {
  if (isCookieTypeAllowed(type)) {
    localStorage.setItem(key, value);
  }
}

// Get cookie with consent check
export function getConsentedCookie(key: string, type: keyof CookieConsent): string | null {
  if (isCookieTypeAllowed(type)) {
    return localStorage.getItem(key);
  }
  return null;
}