import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import MainContent from './components/layout/MainContent';
import NewsContent from './components/layout/NewsContent';
import CursorTrail from './components/common/CursorTrail';
import WaitlistPopup from './components/common/WaitlistPopup';
import './styles/animations.css';
import { articleService } from './services/articleService';
import * as waitlistService from './services/waitlistService';
import { Article, ArticleListItem, UserType, CreatorFormData, BusinessFormData } from './types';
import SEO from './components/common/SEO';

// Font preloading helper - simplified approach
const preloadFonts = () => {
  return new Promise<void>((resolve) => {
    // Wait a short time to allow external fonts to load
    setTimeout(resolve, 300);
  });
};

// Create an ArticlePage component to display individual articles
const ArticlePage: React.FC = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<ArticleListItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.replace('/articles/', '');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const articleData = await articleService.getArticleBySlug(slug);
        setArticle(articleData);
        
        if (articleData) {
          // Fetch related articles
          const related = await articleService.getRelatedArticles(articleData.id, 3);
          setRelatedArticles(related);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShareClick = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || 'Harrpy Article';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy link:', err);
          });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/news')}
          className="px-6 py-3 bg-transparent text-black font-medium rounded-[4px] border border-black shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-black/5 transition-colors duration-300 ease-in-out"
        >
          Back to News
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.seo?.title || article.title}
        description={article.seo?.description || article.summary}
        ogImage={article.image.url}
        canonical={`${window.location.origin}/articles/${article.slug}`}
      />
      
      <div className="pt-8 px-6 md:px-12 lg:px-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate('/news')}
            className="flex items-center mb-8 text-black/70 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </button>
          
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-black/80 text-white rounded-md text-sm">
              {article.category.name}
            </span>
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-6">{article.title}</h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="text-sm text-gray-500">
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="mx-2">•</span>
                <span>{article.readingTime} min read</span>
              </div>
            </div>
            
            {/* Share options */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleShareClick('twitter')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                aria-label="Share on Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </button>
              <button 
                onClick={() => handleShareClick('facebook')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                aria-label="Share on Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShareClick('linkedin')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShareClick('copy')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                aria-label="Copy Link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={article.image.url} 
              alt={article.image.alt} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
            {article.image.caption && (
              <p className="text-sm text-gray-500 italic mt-2 px-4 py-2">{article.image.caption}</p>
            )}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content
              .replace(/\n\n/g, '</p><p>')
              .replace(/\n/g, '<br>')
              .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold font-headline mb-4 mt-8">$1</h1>')
              .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold font-headline mb-3 mt-6">$1</h2>')
              .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold font-headline mb-3 mt-5">$1</h3>')
              .replace(/^\* (.*$)/gm, '<li class="ml-6 mb-2">$1</li>')
              .replace(/<li class="ml-6 mb-2">(.*)<\/li>/g, '<ul class="list-disc mb-4"><li class="ml-6 mb-2">$1</li></ul>')
              .replace(/^>(.*$)/gm, '<blockquote class="pl-4 border-l-4 border-black/20 italic my-4">$1</blockquote>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }} />
          </div>
          
          {/* Share section at the bottom */}
          <div className="mt-12 border-t border-b border-black/10 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h3 className="font-bold text-lg mb-4 sm:mb-0">Share this article</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleShareClick('twitter')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                  <span>Tweet</span>
                </button>
                <button 
                  onClick={() => handleShareClick('copy')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(article => (
                <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover-lift transition-all duration-300">
                  <div className="h-48 relative">
                    <img 
                      src={article.image.url} 
                      alt={article.image.alt} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-white rounded-md text-sm">
                      {article.category.name}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-500">{article.readingTime} min read</p>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">{article.title}</h3>
                    <Link 
                      to={`/articles/${article.slug}`} 
                      className="mt-1 inline-block text-sm font-medium text-black hover:underline transition-all duration-300"
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
            />
            <p className="text-black font-medium">Harrpy</p>
          </div>
          <div className="text-sm text-black/60">
            © {new Date().getFullYear()} Harrpy. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

/**
 * Main App component that serves as the entry point for the Harrpy application.
 * It assembles the primary layout components and decorative elements.
 */
function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainView = location.pathname === '/' || location.pathname === '';
  const isNewsView = location.pathname === '/news';
  
  // Add state for waitlist popup
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Preload fonts
  useEffect(() => {
    preloadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Function to handle navigation
  const handleNavigation = (view: string) => {
    if (view === 'main' && !isMainView) {
      navigate('/');
    } else if (view === 'news' && !isNewsView) {
      navigate('/news');
    }
  };
  
  // Function to open waitlist popup
  const handleOpenWaitlist = () => {
    setIsWaitlistOpen(true);
  };
  
  // Function to handle email submission from hero section
  const handleEmailSubmit = (email: string) => {
    setSubmittedEmail(email);
    setIsWaitlistOpen(true);
  };
  
  // Function to close waitlist popup
  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
  };
  
  // Function to handle waitlist submission
  const handleWaitlistSubmit = async (data: CreatorFormData | BusinessFormData, userType: UserType) => {
    console.log('Waitlist submission:', { data, userType });
    
    try {
      // Initialize database tables if they don't exist yet
      await waitlistService.initDatabase();
      
      // Save the submission to the database
      const submissionId = await waitlistService.saveWaitlistSubmission(data, userType);
      
      if (submissionId) {
        console.log(`Submission saved successfully with ID: ${submissionId}`);
        setWaitlistSuccess(true);
        setIsWaitlistOpen(false);
        setTimeout(() => {
          setWaitlistSuccess(false);
        }, 5000);
      } else {
        console.error('Failed to save submission - no ID returned');
        // Handle error case
        alert('Something went wrong with your submission. Please try again.');
      }
    } catch (error) {
      console.error('Error saving waitlist submission:', error);
      // Handle error case
      alert('Something went wrong with your submission. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FFF5E9] font-sans overflow-x-hidden ${fontsLoaded ? 'fonts-loaded' : 'fonts-loading'}`}>
      {/* Custom cursor with swirl trail effect */}
      <CursorTrail />
      
      <div className="relative z-10 flex-grow" id="top">
        <Navbar 
          onNavigate={handleNavigation} 
          currentView={isNewsView ? 'news' : 'main'}
          onOpenWaitlist={handleOpenWaitlist}
        />
        
        {/* Hero section - only shown on main page */}
        {isMainView && <Hero />}
        
        {/* Content routes */}
        <Routes>
          <Route path="/" element={
            <MainContent 
              onEmailSubmit={handleEmailSubmit} 
              onOpenWaitlist={handleOpenWaitlist}
            /> 
          } />
          <Route path="/news" element={<NewsContent />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
        </Routes>
        
        {/* Waitlist Popup - moved to App level */}
        <WaitlistPopup 
          isOpen={isWaitlistOpen}
          onClose={handleCloseWaitlist}
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
    </div>
  );
}

export default App;