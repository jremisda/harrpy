import React from 'react';
import SEO from '../common/SEO';
import SocialMediaIcons from '../common/SocialMediaIcons';

const CookiePolicy: React.FC = () => {
  return (
    <div className="pt-4 md:pt-8 px-6 md:px-12 lg:px-24 pb-12 min-h-screen bg-[#FFF5E9]">
      <SEO
        title="Cookie Policy | Harrpy"
        description="Learn about how Harrpy uses cookies to improve your experience and protect your privacy."
      />
      <div className="max-w-4xl mx-auto article-content">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">Cookie Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Effective Date: 4th of May, 2025</p>

        <p className="mb-8">We use cookies to make Harrpy work better — faster performance, smarter insights, and a smoother experience. This policy explains what cookies we use, why we use them, and how you can manage your choices.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">1. What Are Cookies?</h2>
        <p className="mb-4">Cookies are small text files stored on your device when you visit a website. Some are temporary and disappear when you close your browser. Others stick around so we can recognize you when you come back.</p>
        <p className="mb-8">They're not viruses. They're not spyware. They're just part of how the modern internet works.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">2. Why We Use Cookies</h2>
        <p className="mb-4">We use cookies to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Make the site function correctly</li>
          <li>Understand how people use Harrpy (which pages they visit, where they drop off)</li>
          <li>Improve speed, security, and performance</li>
          <li>Learn what's working and what isn't so we can improve</li>
        </ul>
        <p className="mb-8">We don't use cookies to show ads, track you across other websites, or sell your data.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">3. Types of Cookies We Use</h2>
        <p className="mb-4">Here's a breakdown:</p>
        
        <h3 className="text-xl font-bold font-headline mb-3 mt-6">Essential Cookies</h3>
        <p className="mb-6">These make the site work. They handle things like form submissions, page loading, and security. Without them, the site won't run properly.</p>

        <h3 className="text-xl font-bold font-headline mb-3 mt-6">Analytics Cookies</h3>
        <p className="mb-4">These help us understand how people use Harrpy so we can improve. We use:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Google Analytics - tracks site traffic and behavior</li>
          <li>Vercel Analytics - monitors performance and page load stats</li>
        </ul>
        <p className="mb-8">These tools anonymize data where possible. We don't use them to identify individuals unless you've submitted your info via a form.</p>

        <h3 className="text-xl font-bold font-headline mb-3 mt-6">Performance & Security Cookies</h3>
        <p className="mb-8">These come from Cloudflare and other backend services. They help prevent abuse, block bots, and speed up content delivery.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">4. Third-Party Tools</h2>
        <p className="mb-4">Some cookies come from tools we use. These third parties have their own privacy policies:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">Google Privacy Policy</a></li>
          <li><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">Cloudflare Privacy Policy</a></li>
          <li><a href="https://vercel.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">Vercel Privacy Policy</a></li>
        </ul>
        <p className="mb-8">We only work with providers we trust.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">5. Your Choices</h2>
        <p className="mb-4">When you visit Harrpy.com, you'll see a banner asking for consent to use non-essential cookies. You can:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Accept all cookies</li>
          <li>Manage preferences and choose what you're okay with</li>
          <li>Decline non-essential cookies entirely</li>
        </ul>
        <p className="mb-8">You can also control cookies in your browser settings - block them, clear them, or get notified when they're used.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">6. Changes to This Policy</h2>
        <p className="mb-8">We'll update this page if anything changes, new tools, new types of cookies, or new laws. When we do, we'll update the date at the top of this page.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">7. Questions?</h2>
        <p className="mb-4">If you have questions about how we use cookies or data, we're here:</p>
        <p className="mb-8"><a href="mailto:contact@harrpy.com" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">contact@harrpy.com</a></p>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-4">
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rl7LZcaL4a4Cldfw48Eq3jYXenBi2d.png" 
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

export default CookiePolicy; 