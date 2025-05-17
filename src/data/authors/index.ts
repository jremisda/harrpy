import { Author } from '../../types';

// Author data
export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'Sophie Anderson',
    avatar: '/images/authors/sophia.png',
    bio: 'Digital content strategist and travel influencer based in Bali',
    role: 'Content Strategist',
    socialLinks: {
      instagram: 'https://instagram.com/sophieanderson',
      twitter: 'https://twitter.com/sophieanderson',
    }
  },
  {
    id: 'author-2',
    name: 'Daniel Nguyen',
    avatar: '/images/authors/daniel.png',
    bio: 'Photographer and creative director with a focus on sustainability',
    role: 'Head of Photography',
    socialLinks: {
      instagram: 'https://instagram.com/danielnguyen',
      linkedin: 'https://linkedin.com/in/danielnguyen',
    }
  },
  {
    id: 'author-3',
    name: 'Emma Lewis',
    avatar: '/images/authors/emma.png',
    bio: 'Tech writer and product specialist at Harrpy',
    role: 'Product Specialist',
    socialLinks: {
      twitter: 'https://twitter.com/emmalewis',
      linkedin: 'https://linkedin.com/in/emmalewis',
    }
  }
];

export default authors; 