import { Article } from '../../types';
import { authors } from '../authors';
import { categories } from '../categories';
import { tags } from '../tags';

const article: Article = {
  id: 'article-1',
  title: 'Harrpy Launches Early Access Program',
  slug: 'harrpy-launches-early-access-program',
  summary: 'Harrpy announces its early access program for creators and businesses in Bali, aiming to revolutionize the creator economy.',
  content: `
# Harrpy Launches Early Access Program

We're thrilled to announce the launch of Harrpy's Early Access Program, designed specifically for creators and businesses in Bali. This program marks our first step toward revolutionizing how creators and businesses connect, collaborate, and grow together.

## What This Means For Creators

Verified creators will get:

- Six months of Harrpy Pro completely free
- Top placement in the match feed to maximize visibility
- Early adopter badge to establish credibility
- 50% off Harrpy Pro for 2 years after the free period ends

## What This Means For Businesses

Businesses will benefit from:

- Six months of Harrpy Pro at no cost
- Priority placement for collaboration briefs
- Verified business status with founding partner recognition
- 50% discount on Harrpy Pro for 2 years following the initial period

## How To Apply

Joining is simple:

1. Submit your email through our waitlist form
2. Complete the verification process
3. If selected, you'll receive full access within 48 hours

We're accepting applications on a rolling basis, with priority given to active creators and businesses in the Bali region.

Stay tuned for more updates as we expand to other locations in Southeast Asia in the coming months.
  `,
  publishedAt: '2023-06-15T08:00:00Z',
  updatedAt: '2023-06-16T10:15:00Z',
  image: {
    url: '/images/articles/harrpy-launches-early-access-program/hero.jpg',
    alt: 'Harrpy Early Access Program announcement',
    caption: 'Harrpy is changing how creators and businesses connect in Bali'
  },
  author: authors[0],
  category: categories[0],
  tags: [tags[2], tags[3], tags[4]],
  readingTime: 4,
  featured: true,
  status: 'published',
  seo: {
    title: 'Harrpy Launches Early Access Program for Bali Creators',
    description: 'Join Harrpy\'s exclusive early access program for verified creators and businesses in Bali with six months of free Pro access.',
    keywords: ['early access', 'creator economy', 'Bali', 'collaboration platform']
  }
};

export default article; 