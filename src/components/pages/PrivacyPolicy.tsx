import React from 'react';
import SEO from '../common/SEO';
import SocialMediaIcons from '../common/SocialMediaIcons';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-4 md:pt-8 px-6 md:px-12 lg:px-24 pb-12 min-h-screen bg-[#FFF5E9]">
      <SEO
        title="Privacy Policy | Harrpy"
        description="Read Harrpy's privacy policy to understand how we protect your data and privacy as a creator or brand."
      />
      <div className="max-w-4xl mx-auto article-content">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Effective Date: 4th of May, 2025</p>
        
        <p className="mb-8">At Harrpy, we believe privacy shouldn't be buried in legal jargon. So here's exactly what data we collect, why we collect it, and what you can do about it.</p>
        <p className="mb-8">This applies to anyone visiting harrpy.com, joining our waitlist, submitting a form, or interacting with us before the platform goes live.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">1. What We Collect</h2>
        <p className="mb-4">When you interact with Harrpy, we collect two types of data:</p>
        
        <h3 className="text-xl font-bold font-headline mb-3 mt-6">Information you provide directly:</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>First and last name</li>
          <li>Email address</li>
          <li>Social media handles (Instagram, TikTok, YouTube, etc.)</li>
          <li>Business name and website URL (for agencies or brands)</li>
          <li>Any other info you choose to give us through waitlist forms or contact fields</li>
        </ul>

        <h3 className="text-xl font-bold font-headline mb-3 mt-6">Information collected automatically:</h3>
        <p className="mb-4">We use trusted tools to collect non-personal data about how people use the site:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Browser type and version</li>
          <li>Device type</li>
          <li>IP address (used for general location and security)</li>
          <li>Pages viewed, time on page, bounce rate</li>
          <li>Site performance and error reporting</li>
        </ul>

        <p className="mb-4">This data comes from:</p>
        <ul className="list-disc pl-6 mb-8 space-y-2">
          <li>Google Analytics</li>
          <li>Vercel Analytics</li>
          <li>Cloudflare (for security and content delivery)</li>
        </ul>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">2. Why We Collect It</h2>
        <p className="mb-4">Here's what we do with the data:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Add you to our waitlist</li>
          <li>Contact you about early access, platform updates, or perks</li>
          <li>Understand who's engaging with Harrpy so we can build something people actually want</li>
          <li>Prevent spam, abuse, or misuse of the site</li>
          <li>Improve site speed, functionality, and experience</li>
        </ul>
        <p className="mb-8 font-medium">We don't sell your data. Ever.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">3. Third-Party Tools We Use</h2>
        <p className="mb-4">We rely on a few services to run the site smoothly and learn what's working:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Google Analytics – tracks site usage</li>
          <li>Vercel – handles analytics and site hosting</li>
          <li>Cloudflare – protects and speeds up the site</li>
        </ul>
        <p className="mb-8">These providers may process your data according to their own privacy policies. We chose them because they're secure, reputable, and industry-standard.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">4. Cookies</h2>
        <p className="mb-4">Yes, Harrpy uses cookies. Some are essential to make the site work. Others help us understand how people use the site or keep things running fast.</p>
        <p className="mb-4">You'll see a banner asking for consent when you land on our site.</p>
        <p className="mb-8">Want to know more? Read our Cookie Policy.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">5. Your Rights</h2>
        <p className="mb-4">Depending on where you live, you may have rights under laws like GDPR or CCPA, including:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Accessing the personal data we hold about you</li>
          <li>Asking us to delete it</li>
          <li>Updating or correcting your info</li>
          <li>Withdrawing consent for marketing emails</li>
        </ul>
        <p className="mb-8">To do any of the above, email us at <a href="mailto:contact@harrpy.com" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">contact@harrpy.com</a> and we'll take care of it.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">6. Data Retention</h2>
        <p className="mb-8">We only keep your data as long as it's needed to run the waitlist, communicate with you, and learn from site usage. If you ask us to delete your info, we will.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">7. Data Security</h2>
        <p className="mb-8">We use modern, secure tools and hosting providers (like Vercel and Cloudflare) to protect your data. But no system is 100% bulletproof, so we encourage you to avoid sharing sensitive personal data unless necessary.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">8. Changes to This Policy</h2>
        <p className="mb-8">We'll update this page if anything changes about how we handle data. When we do, we'll update the date at the top. If the changes are major, we'll let you know directly.</p>

        <h2 className="text-2xl font-bold font-headline mb-4 mt-8">9. Contact</h2>
        <p className="mb-4">Questions about privacy? Want to update or remove your data?</p>
        <p className="mb-4">Reach out to us:</p>
        <p className="mb-8"><a href="mailto:contact@harrpy.com" className="text-blue-600 border-b border-blue-600/20 hover:border-current transition-all duration-200">contact@harrpy.com</a></p>

        <p className="mb-8">We're building this with creators and brands in mind and that includes respecting your privacy from day one.</p>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 lg:px-24 py-8 mt-4">
        <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-0 relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/harrpy-logo.png" 
              alt="Harrpy Logo" 
              className="h-10 w-auto mr-2"
              loading="eager"
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60 mb-4 md:mb-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span>© {new Date().getFullYear()} Harrpy. All rights reserved.</span>
            <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200">Privacy Policy</a>
          </div>
          <SocialMediaIcons />
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy; 