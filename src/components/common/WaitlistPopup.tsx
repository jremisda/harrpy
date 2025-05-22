import React, { useState, useEffect, useRef } from 'react';
import OptimizedImage from '../common/OptimizedImage';

type UserType = 'creator' | 'business' | null;

interface SocialMediaHandles {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

interface CreatorFormData {
  firstName: string;
  lastName: string;
  socialMediaHandles: SocialMediaHandles;
  email: string;
  aboutYourself?: string;
}

interface BusinessFormData {
  businessName: string;
  websiteUrl: string;
  email: string;
  creatorDescription?: string;
}

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  onSubmit: (data: CreatorFormData | BusinessFormData, userType: UserType) => void;
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({
  isOpen,
  onClose,
  initialEmail,
  onSubmit
}) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [stage, setStage] = useState<'selection' | 'form'>('selection');
  
  // Creator form state
  const [creatorForm, setCreatorForm] = useState<CreatorFormData>({
    firstName: '',
    lastName: '',
    socialMediaHandles: {},
    email: initialEmail,
    aboutYourself: ''
  });
  
  // Business form state
  const [businessForm, setBusinessForm] = useState<BusinessFormData>({
    businessName: '',
    websiteUrl: '',
    email: initialEmail,
    creatorDescription: ''
  });
  
  // Social media platform tracking
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  
  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Refs
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Update email when initialEmail prop changes
  useEffect(() => {
    setCreatorForm(prev => ({
      ...prev,
      email: initialEmail
    }));
    
    setBusinessForm(prev => ({
      ...prev,
      email: initialEmail
    }));
  }, [initialEmail]);
  
  // Reset form when popup closes
  useEffect(() => {
    if (!isOpen) {
      setUserType(null);
      setStage('selection');
      setFormErrors({});
      setSocialPlatforms([]);
    }
  }, [isOpen]);
  
  // Handle user type selection
  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setStage('form');
  };
  
  // Add social platform
  const addSocialPlatform = (platform: string) => {
    if (!socialPlatforms.includes(platform)) {
      setSocialPlatforms([...socialPlatforms, platform]);
    }
  };
  
  // Remove social platform
  const removeSocialPlatform = (platform: string) => {
    setSocialPlatforms(socialPlatforms.filter(p => p !== platform));
    setCreatorForm({
      ...creatorForm,
      socialMediaHandles: {
        ...creatorForm.socialMediaHandles,
        [platform.toLowerCase()]: ''
      }
    });
  };
  
  // Handle creator form changes
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social-')) {
      const platform = name.split('-')[1];
      setCreatorForm({
        ...creatorForm,
        socialMediaHandles: {
          ...creatorForm.socialMediaHandles,
          [platform]: value
        }
      });
    } else {
      setCreatorForm({
        ...creatorForm,
        [name]: value
      });
    }
  };
  
  // Handle business form changes
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessForm({
      ...businessForm,
      [name]: value
    });
  };
  
  // Validate creator form
  const validateCreatorForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!creatorForm.firstName.trim()) {
      errors.firstName = 'Please enter your first name';
    }
    
    if (!creatorForm.lastName.trim()) {
      errors.lastName = 'Please enter your last name';
    }
    
    if (!creatorForm.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(creatorForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (socialPlatforms.length === 0) {
      errors.socialMedia = 'Please add at least one social media handle';
    } else {
      // Check if handles are filled for selected platforms
      socialPlatforms.forEach(platform => {
        const handle = creatorForm.socialMediaHandles[platform.toLowerCase() as keyof SocialMediaHandles];
        if (!handle) {
          errors[`social-${platform}`] = `Please enter your ${platform} handle`;
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate business form
  const validateBusinessForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!businessForm.businessName.trim()) {
      errors.businessName = 'Please enter your business name';
    }
    
    if (!businessForm.websiteUrl.trim()) {
      errors.websiteUrl = 'Please enter your website URL';
    }
    
    if (!businessForm.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(businessForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'creator') {
      if (validateCreatorForm()) {
        onSubmit(creatorForm, userType);
        onClose();
      }
    } else if (userType === 'business') {
      if (validateBusinessForm()) {
        // Ensure website URL has a protocol
        const formData = { ...businessForm };
        if (formData.websiteUrl && !formData.websiteUrl.match(/^https?:\/\//)) {
          formData.websiteUrl = `https://${formData.websiteUrl}`;
        }
        
        onSubmit(formData, userType);
        onClose();
      }
    }
  };
  
  // Available social media platforms
  const availablePlatforms = ['Instagram', 'Tiktok', 'Youtube', 'X'];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex justify-end z-50 bg-black/30 backdrop-blur-sm">
      <div 
        ref={popupRef}
        className="w-full max-w-md h-full bg-[#FFF5E9] shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col rounded-l-[32px]"
        style={{ 
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Header with horizontal line */}
        <div className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline text-3xl font-bold text-black">
              {stage === 'selection' ? 'Join the Waitlist' : userType === 'creator' ? 'Creator Details' : 'Business Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
        </div>
        
        <div className="px-8 pb-8 flex-grow overflow-y-auto">
          {stage === 'selection' ? (
            <div className="space-y-6">
              <p className="text-black/80 text-lg">Please select your user type:</p>
              
              <div className="grid grid-cols-1 gap-5">
                <button
                  onClick={() => handleUserTypeSelect('creator')}
                  className="px-6 py-8 bg-white/40 backdrop-blur-md text-center text-black font-medium rounded-[12px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out"
                >
                  <span className="text-xl">I'm a Creator</span>
                </button>
                
                <button
                  onClick={() => handleUserTypeSelect('business')}
                  className="px-6 py-8 bg-white/40 backdrop-blur-md text-center text-black font-medium rounded-[12px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out"
                >
                  <span className="text-xl">I'm a Business or Agency</span>
                </button>
              </div>
            </div>
          ) : userType === 'creator' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black/80 mb-1 text-sm font-medium">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={creatorForm.firstName}
                      onChange={handleCreatorChange}
                      className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.firstName ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                      required
                    />
                    {formErrors.firstName && (
                      <div className="flex items-center mt-1.5 space-x-1">
                        <span className="text-black/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="text-black/70 text-xs">{formErrors.firstName}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-black/80 mb-1 text-sm font-medium">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={creatorForm.lastName}
                      onChange={handleCreatorChange}
                      className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.lastName ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                      required
                    />
                    {formErrors.lastName && (
                      <div className="flex items-center mt-1.5 space-x-1">
                        <span className="text-black/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="text-black/70 text-xs">{formErrors.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Social Media Handles* (add at least one)</label>
                {formErrors.socialMedia && (
                  <div className="flex items-center mb-2 space-x-1">
                    <span className="text-black/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-black/70 text-xs">{formErrors.socialMedia}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {availablePlatforms.map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => socialPlatforms.includes(platform) 
                        ? removeSocialPlatform(platform)
                        : addSocialPlatform(platform)
                      }
                      className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                        socialPlatforms.includes(platform)
                          ? 'bg-black text-white border-black shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                          : 'bg-transparent text-black/70 border-black/20 hover:border-black'
                      }`}
                    >
                      {platform} {socialPlatforms.includes(platform) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
                
                {socialPlatforms.map(platform => (
                  <div key={platform} className="mb-3">
                    <input
                      type="text"
                      name={`social-${platform.toLowerCase()}`}
                      placeholder={`${platform} handle (e.g. @username)`}
                      value={creatorForm.socialMediaHandles[platform.toLowerCase() as keyof SocialMediaHandles] || ''}
                      onChange={handleCreatorChange}
                      className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors[`social-${platform}`] ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                    />
                    {formErrors[`social-${platform}`] && (
                      <div className="flex items-center mt-1.5 space-x-1">
                        <span className="text-black/70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span className="text-black/70 text-xs">{formErrors[`social-${platform}`]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={creatorForm.email}
                  onChange={handleCreatorChange}
                  className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.email ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                  required
                />
                {formErrors.email && (
                  <div className="flex items-center mt-1.5 space-x-1">
                    <span className="text-black/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-black/70 text-xs">{formErrors.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Tell us more about yourself (optional)</label>
                <textarea
                  name="aboutYourself"
                  value={creatorForm.aboutYourself}
                  onChange={handleCreatorChange}
                  className="w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border border-black/20 focus:outline-none focus:border-black shadow-inner"
                  rows={4}
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-transparent text-black font-medium rounded-[8px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Business or Agency Name*</label>
                <input
                  type="text"
                  name="businessName"
                  value={businessForm.businessName}
                  onChange={handleBusinessChange}
                  className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.businessName ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                  required
                />
                {formErrors.businessName && (
                  <div className="flex items-center mt-1.5 space-x-1">
                    <span className="text-black/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-black/70 text-xs">{formErrors.businessName}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Website URL*</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={businessForm.websiteUrl}
                  onChange={handleBusinessChange}
                  placeholder="https://your-website.com"
                  className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.websiteUrl ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                  required
                />
                {formErrors.websiteUrl && (
                  <div className="flex items-center mt-1.5 space-x-1">
                    <span className="text-black/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-black/70 text-xs">{formErrors.websiteUrl}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={businessForm.email}
                  onChange={handleBusinessChange}
                  className={`w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border ${formErrors.email ? 'border-black/50 ring-1 ring-black/50' : 'border-black/20'} focus:outline-none focus:border-black shadow-inner`}
                  required
                />
                {formErrors.email && (
                  <div className="flex items-center mt-1.5 space-x-1">
                    <span className="text-black/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-black/70 text-xs">{formErrors.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-black/80 mb-1 text-sm font-medium">Tell us what kind of creators you're looking for (optional)</label>
                <textarea
                  name="creatorDescription"
                  value={businessForm.creatorDescription}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-[8px] bg-white/60 backdrop-blur-sm text-black border border-black/20 focus:outline-none focus:border-black shadow-inner"
                  rows={4}
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-transparent text-black font-medium rounded-[8px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer with copyright */}
        <div className="px-8 py-4 mt-auto flex-shrink-0">
          <div className="h-0.5 w-full bg-[#121212] mb-6"></div>
          <div className="flex items-center justify-center gap-2">
            <img 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/harrpy-logo-rI7LZcaL4a4CIdfw48Eq3jYXenBi2d.png" 
              alt="Harrpy Logo" 
              className="h-5 w-auto mr-1.5"
            />
            <p className="text-center text-black/40 text-sm font-medium">{new Date().getFullYear()}</p>
            <a href="/privacy" className="text-black/40 hover:text-black underline transition-colors duration-200 text-xs">Privacy Policy</a>
            <a href="/terms" className="text-black/40 hover:text-black underline transition-colors duration-200 text-xs">Terms of Use</a>
            <a href="/cookies" className="text-black/40 hover:text-black underline transition-colors duration-200 text-xs">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPopup; 