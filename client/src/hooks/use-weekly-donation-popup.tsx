import { useState, useEffect } from 'react';

interface WeeklyDonationPopupHook {
  showPopup: boolean;
  dismissPopup: () => void;
  handleDonate: () => void;
}

export function useWeeklyDonationPopup(): WeeklyDonationPopupHook {
  const [showPopup, setShowPopup] = useState(false);
  
  useEffect(() => {
    const checkSundayPopup = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Only show on Sundays
      if (dayOfWeek !== 0) return;
      
      const lastShown = localStorage.getItem('lastDonationPopupShown');
      const currentWeek = getWeekNumber(now);
      
      // Show popup if:
      // 1. Never shown before, OR
      // 2. Last shown in a different week
      if (!lastShown || parseInt(lastShown) !== currentWeek) {
        // Add a small delay to ensure the app is fully loaded
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 3000); // 3 second delay after app loads
        
        return () => clearTimeout(timer);
      }
    };
    
    checkSundayPopup();
  }, []);
  
  const dismissPopup = () => {
    const currentWeek = getWeekNumber(new Date());
    localStorage.setItem('lastDonationPopupShown', currentWeek.toString());
    setShowPopup(false);
  };
  
  const handleDonate = () => {
    window.open('https://buy.stripe.com/bJefZhf0Ab521kr8Mh0ZW00', '_blank');
    dismissPopup();
  };
  
  return {
    showPopup,
    dismissPopup,
    handleDonate
  };
}

// Helper function to get week number of the year
function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}