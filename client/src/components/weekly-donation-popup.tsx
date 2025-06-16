import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, X } from "lucide-react";
import { useWeeklyDonationPopup } from "@/hooks/use-weekly-donation-popup";
import scholarLogo from "@assets/ZiNRAi-7_1750106794159.png";

export default function WeeklyDonationPopup() {
  const { showPopup, dismissPopup, handleDonate } = useWeeklyDonationPopup();

  return (
    <Dialog open={showPopup} onOpenChange={() => dismissPopup()}>
      <DialogContent className="sm:max-w-md bg-[var(--scholar-dark)] border-gray-700 text-white">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[var(--scholar-gold)]/10 rounded-full flex items-center justify-center">
              <img 
                src={scholarLogo} 
                alt="The Scholar" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          
          <DialogTitle className="text-xl text-white text-center">
            Every Sunday, we send out an opportunity to sow.
          </DialogTitle>
          
          <DialogDescription className="text-gray-300 text-center space-y-4 text-base leading-relaxed">
            <p>
              The Scholar is more than just a tool—it's a movement to help pastors, teachers, and Bible lovers across the world engage the Word of God with depth, clarity, and confidence.
            </p>
            
            <p>
              If The Scholar has been a blessing to you, would you consider sowing into this work?
            </p>
            
            <p>
              Your donation helps us keep building, expanding, and equipping more voices for the Kingdom.
            </p>
            
            <p className="text-[var(--scholar-gold)] font-medium">
              Click below to give—and thank you for being part of this mission.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-6">
          <Button
            onClick={handleDonate}
            className="w-full bg-[var(--scholar-gold)] text-black hover:bg-yellow-500 font-semibold py-3"
          >
            <Heart className="h-4 w-4 mr-2" />
            Give a Donation
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          
          <Button
            onClick={dismissPopup}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            <X className="h-4 w-4 mr-2" />
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}