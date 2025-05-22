import React from 'react';
import SEO from '../common/SEO';
import SocialMediaIcons from '../common/SocialMediaIcons';

const TermsOfUse: React.FC = () => {
  return (
    <div className="pt-4 md:pt-8 px-6 md:px-12 lg:px-24 pb-12 min-h-screen bg-[#FFF5E9]">
      <SEO
        title="Terms of Use | Harrpy"
        description="Read Harrpy's terms of use to understand the rules and guidelines for using our platform."
      />
      <div className="max-w-4xl mx-auto article-content">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">Terms of Use</h1>
        <p className="text-gray-500 text-sm mb-8">Effective Date: 4th of May, 2025</p>

        <p className="mb-8">Welcome to Harrpy. This site is here to connect creators and brands — and this page sets the ground rules.</p>
        <p className="mb-8">By using harrpy.com (including signing up for our waitlist or filling out any form), you agree to these terms. If you don't agree, please don't use the site.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">1. Who Can Use Harrpy</h2>
        <p className="mb-4">To use our site or sign up:</p>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>You must be 18 or older (or have legal permission to enter into agreements)</li>
          <li>You must provide accurate info. No fake names, handles, or emails</li>
          <li>You're using Harrpy in good faith, not to spam, scam, or scrape data</li>
        </ul>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">2. What This Site Is (and Isn't)</h2>
        <p className="mb-4">Harrpy is currently in pre-launch. That means:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>We're collecting waitlist signups to prepare for launch</li>
          <li>We may reach out with updates, early access, or perks</li>
          <li>Submitting your info does not guarantee access, perks, or platform entry</li>
        </ul>
        <p className="mb-8">We're not responsible for any assumptions based on what you see on the site, features and perks may change.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">3. Intellectual Property</h2>
        <p className="mb-4">All content on this site (text, visuals, branding, design, code) belongs to Harrpy or our partners. Don't reuse, reproduce, or republish anything without written permission.</p>
        <p className="mb-8">Creators and businesses submitting information retain ownership of their own names, handles, logos, and other personal assets. We're not claiming those.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">4. What You Can't Do</h2>
        <p className="mb-4">Using our site means you agree not to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Spam or flood our forms</li>
          <li>Pretend to be someone you're not</li>
          <li>Use bots or automation to scrape data or game the waitlist</li>
          <li>Try to reverse-engineer our systems or mess with our backend</li>
          <li>Upload malicious code or anything that could break the site</li>
        </ul>
        <p className="mb-8">Basically, be cool. We're building this for you.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">5. Limitation of Liability</h2>
        <p className="mb-4">We do our best to keep things accurate and secure, but we can't promise:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>The site will always be available or error-free</li>
          <li>Your data will never be interrupted or lost</li>
          <li>You'll get early access or perks, even if you join the waitlist</li>
        </ul>
        <p className="mb-8">Use Harrpy at your own risk. We're not liable for any damages related to your use or inability to use the site.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">6. Third-Party Services</h2>
        <p className="mb-8">We use tools like Google Analytics, Vercel, and Cloudflare to run the site and understand usage. By using Harrpy, you acknowledge that these services may process some of your data. See our <a href="/privacy" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">Privacy Policy</a> for more on that.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">7. Changes to These Terms</h2>
        <p className="mb-8">We may update these terms at any time. When we do, we'll revise the "Last Updated" date. If it's a big change, we'll let you know via email or a notice on the site.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">8. Contact</h2>
        <p className="mb-4">If you've got questions, concerns, or need help, reach out:</p>
        <p className="mb-8"><a href="mailto:contact@harrpy.com" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">contact@harrpy.com</a></p>

        <p className="mb-8">Thanks for being early. We're building Harrpy for people like you — fast, direct, and built on trust.</p>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-4">
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="eager"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60 mb-4 md:mb-0 flex flex-col items-center gap-2">
            <span>© {new Date().getFullYear()} Harrpy. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200">Privacy Policy</a>
              <a href="/terms" className="text-black/40 hover:text-black underline transition-colors duration-200">Terms of Use</a>
              <a href="/cookies" className="text-black/40 hover:text-black underline transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
          <SocialMediaIcons />
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse; 