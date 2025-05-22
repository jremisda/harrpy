import React from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { ArticleCategory } from '../../types';

interface NewsCategoriesProps {
  categories: ArticleCategory[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const NewsCategories: React.FC<NewsCategoriesProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="px-6 md:px-12 lg:px-24 pt-8 pb-12">
      <div className="w-full">
        <div className="rounded-[32px] h-[300px] md:h-[320px] overflow-hidden relative">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full">
            <OptimizedImage 
              src="https://tdkqhl7odedylxty.public.blob.vercel-storage.com/website/news-bg-a9D7x55iQYIqS61Da03gl4VuRXiOrr.webp" 
              alt="News categories background" 
              placeholderColor="#242424"
              eager={true}
            />
            {/* Light overlay */}
            <div className="absolute inset-0 bg-black/25 backdrop-brightness-90"></div>
          </div>

          <div className="absolute inset-0 p-10 md:p-12">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 relative z-10">
                Fresh From the Feed
              </h2>
              
              {/* Category filters with styled buttons */}
              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <button 
                  onClick={() => onCategoryChange(null)}
                  className={`px-6 py-3 font-medium rounded-[4px] border transition-all duration-300 ease-in-out ${
                    selectedCategory === null 
                      ? 'bg-transparent text-white border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                      : 'text-white/80 border-white/50 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => onCategoryChange(category.slug)}
                    className={`px-6 py-3 font-medium rounded-[4px] border transition-all duration-300 ease-in-out ${
                      selectedCategory === category.slug 
                        ? 'bg-transparent text-white border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'text-white/80 border-white/50 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCategories; 