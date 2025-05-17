# Managing Articles

This directory contains all the articles for the Harrpy blog/news section. The structure is designed to make it easy to add, edit, or remove articles without having to modify the main application code.

## Directory Structure

```
src/data/
├── articles/               # Article content
│   ├── index.ts            # Exports all articles and helper functions
│   ├── early-access-program.ts  # Individual article files
│   ├── creator-collaborations.ts
│   └── ...
├── authors/                # Author data
│   └── index.ts
├── categories/             # Category data
│   └── index.ts
└── tags/                   # Tag data
    └── index.ts

public/
└── images/
    └── articles/           # Article images organized by slug
        ├── early-access-program/
        ├── creator-collaborations/
        └── ...
```

## How to Add a New Article

1. **Create a new file** in the `src/data/articles` directory with a name that reflects the article content (use kebab-case).

2. **Copy the template below** and fill in your article details:

```typescript
import { Article } from '../../types';
import { authors } from '../authors';
import { categories } from '../categories';
import { tags } from '../tags';

const article: Article = {
  id: 'article-X',  // Use a unique ID (increment from the last one)
  title: 'Your Article Title',
  slug: 'your-article-slug',  // URL-friendly version of the title
  summary: 'A brief summary of your article (1-2 sentences).',
  content: `
# Your Article Title

Your article content in Markdown format.

## Section Heading

Content goes here...

## Another Section

More content...
  `,
  publishedAt: '2023-11-15T10:00:00Z',  // ISO date string for publication
  updatedAt: '2023-11-15T10:00:00Z',    // Optional, for updates
  image: {
    url: '/images/articles/your-article-slug/hero.jpg',  // Path to the feature image
    alt: 'Description of the image',
    caption: 'Optional caption text'
  },
  author: authors[0],                   // Reference to an existing author
  category: categories[0],              // Reference to an existing category
  tags: [tags[0], tags[1]],             // Array of relevant tags
  readingTime: 5,                       // Estimated reading time in minutes
  featured: false,                      // Whether this is a featured article
  status: 'published',                  // 'published', 'draft', or 'archived'
  seo: {                                // Optional SEO fields
    title: 'SEO-optimized title (if different from main title)',
    description: 'SEO meta description',
    keywords: ['keyword1', 'keyword2']
  }
};

export default article;
```

3. **Import your article in the index.ts file**:

```typescript
// Add this line with the imports at the top
import yourArticle from './your-article-slug';

// Add your article to the articles array
export const articles: Article[] = [
  // ... existing articles
  yourArticle,
  // Add new articles here
];
```

## Managing Article Images

For better organization and maintainability, follow these guidelines for article images:

1. **Create a dedicated folder** for each article:
   ```
   mkdir -p public/images/articles/your-article-slug
   ```

2. **Use consistent naming conventions**:
   - `hero.jpg` - Main feature image
   - `thumbnail.jpg` - Smaller version for cards/lists (if needed)
   - `section-name.jpg` - Images for specific sections
   - `gallery-1.jpg`, `gallery-2.jpg`, etc. - For image galleries

3. **Image optimization**:
   - Compress all images before adding them (use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/))
   - Use modern formats like WebP when possible
   - Recommended dimensions:
     - Hero images: 1200×675px (16:9 ratio)
     - Thumbnails: 400×225px
     - In-article images: 800px width maximum

4. **Reference images in your article** using the path structure:
   ```
   /images/articles/your-article-slug/image-name.jpg
   ```

5. **For inline article images**, use Markdown syntax:
   ```markdown
   ![Alt text for the image](/images/articles/your-article-slug/section-image.jpg)
   ```

## Adding New Authors, Categories, or Tags

If you need to add new authors, categories, or tags:

1. Edit the appropriate file in the corresponding directory:
   - `src/data/authors/index.ts` for authors
   - `src/data/categories/index.ts` for categories 
   - `src/data/tags/index.ts` for tags

2. Add your new entry to the array, making sure to provide all required fields.

3. Reference these new items in your article as needed.

## Article Status Options

- `published`: Visible to all users
- `draft`: Not visible to users, in progress
- `archived`: Previously published content that is no longer actively promoted

## Tips for Writing Great Articles

- Use Markdown formatting for your content
- Include relevant headings (h1 for title, h2 for sections, h3 for subsections)
- Keep paragraphs concise and focused
- Use bullet points or numbered lists for clarity
- Include relevant images with descriptive alt text
- Select appropriate categories and tags
- Write a compelling summary that accurately represents the content 