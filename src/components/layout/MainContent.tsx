import React, { useState } from 'react';
import { HeroCard } from '../sections/HeroCard';
import { MissionStatement } from '../sections/MissionStatement';
import { EarlyAccessBenefits } from '../sections/EarlyAccessBenefits';
import { CTASection } from '../sections/CTASection';
import WaitlistPopup from '../common/WaitlistPopup';
import { UserType, CreatorFormData, BusinessFormData } from '../../types';

export const MainContent: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const handleEmailSubmit = (email: string) => {
    setSubmittedEmail(email);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleWaitlistSubmit = (data: CreatorFormData | BusinessFormData, userType: UserType) => {
    console.log('Waitlist submission:', { data, userType });
    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
    }, 5000);
  };

  return (
    <div className="w-full">
      <HeroCard onEmailSubmit={handleEmailSubmit} />
      
      <section id="early-access">
        <EarlyAccessBenefits />
      </section>
      
      <section id="mission">
        <MissionStatement />
      </section>
      
      <section id="contact">
        <CTASection onEmailSubmit={handleEmailSubmit} />
      </section>

      {/* Waitlist Popup */}
      <WaitlistPopup 
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        initialEmail={submittedEmail}
        onSubmit={handleWaitlistSubmit}
      />

      {/* Success message */}
      {waitlistSuccess && (
        <div className="fixed bottom-8 right-8 bg-[#FFF5E9] border border-black/20 shadow-lg rounded-lg p-4 z-50 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-black font-medium">Your submission has been received!</p>
              <p className="text-black/60 text-sm">We'll reach out if you're selected. Good luck!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent; 