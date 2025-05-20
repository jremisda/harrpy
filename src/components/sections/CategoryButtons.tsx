import React from 'react';
import { ArticleCategory } from '../../types';

interface CategoryButtonsProps {
  categories: ArticleCategory[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="px-6 md:px-12 lg:px-24 pt-4 pb-6">
      {/* Category filters with styled buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onCategoryChange(null)}
          className={`px-5 py-2 font-medium rounded-[4px] border transition-all duration-300 ease-in-out ${
            selectedCategory === null 
              ? 'bg-black text-white border-black shadow-[0_0_10px_rgba(0,0,0,0.1)]' 
              : 'text-black/70 border-black/30 hover:text-black hover:border-black hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button 
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            className={`px-5 py-2 font-medium rounded-[4px] border transition-all duration-300 ease-in-out ${
              selectedCategory === category.slug 
                ? 'bg-black text-white border-black shadow-[0_0_10px_rgba(0,0,0,0.1)]' 
                : 'text-black/70 border-black/30 hover:text-black hover:border-black hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons; 