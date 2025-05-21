# Harrpy - Swipe. Match. Collab.

A modern platform that connects creators with brands for direct, effortless collaborations.

## What is Harrpy?

Harrpy is a swipe-based collaboration platform that connects creators with brands, agencies, and businesses that want to work together — directly, instantly, and without middlemen.

It combines the intuitive user experience of apps like Tinder with the efficiency of a creator marketplace. Both sides swipe, match, and start collaborating without lengthy back-and-forth or unnecessary gatekeepers.

### For Creators

Harrpy provides a centralized space to find real, no-BS brand opportunities — whether you're a micro influencer, model, UGC creator, photographer, or freelance content producer. No ghosting, no endless pitching. Just verified opportunities and instant matches.

### For Brands

Harrpy eliminates the agency layer and streamlines how you source talent — whether you're a boutique hotel, fashion label, café, gym, or property manager. Post a collab brief, browse a curated list of nearby creators, and connect directly.

Whether you're a creator looking to land your next collab or a business looking to generate fresh content fast — Harrpy is where collaboration happens.

It's not another UGC tool. It's a full-spectrum creator-brand connection engine — fast, direct, and built for the new economy.

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- ESLint
- Neon PostgreSQL (for waitlist storage)

## Project Structure

```
src/
├── assets/            # Static assets like images, icons
├── components/        # UI components
│   ├── common/        # Reusable UI components
│   ├── layout/        # Layout components like Navbar, Hero, MainContent
│   └── sections/      # Page sections like HeroCard, MissionStatement
├── hooks/             # Custom React hooks
├── services/          # Service layer (including database services)
├── styles/            # Global styles and CSS
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── App.tsx            # Main App component
└── main.tsx           # Entry point
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Neon PostgreSQL database (for waitlist feature)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd harrpy-landing

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

### Build

```bash
# Build for production
npm run build
# or
yarn build
```

## Waitlist Feature

The application includes a waitlist feature that collects user information and stores it in a Neon PostgreSQL database.

### Setup Instructions

1. Sign up for a free Neon database account at [neon.tech](https://neon.tech)
2. Create a new project and get your connection string
3. Create a `.env` file in the root of the project with the following:

```
# Neon Database connection string
NEON_DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require
```

Replace `user:password@endpoint.neon.tech/neondb` with your actual connection details from Neon.

### How It Works

The waitlist feature:
1. Collects user information through a popup form
2. Validates the input fields
3. Stores the data in two tables:
   - `waitlist_creators` - for creator submissions
   - `waitlist_businesses` - for business submissions

### Tables Structure

**waitlist_creators**
- id (Primary Key)
- first_name
- last_name
- email (Unique)
- instagram
- tiktok
- youtube
- x
- about_yourself
- created_at (Timestamp)

**waitlist_businesses**
- id (Primary Key)
- business_name
- website_url
- email (Unique)
- creator_description
- created_at (Timestamp)

### Accessing the Data

You can access and manage your waitlist data through the Neon dashboard, or by connecting with any PostgreSQL client using the connection string.

## Contributing

Please follow these guidelines when contributing to the project:

1. Follow the existing code style and organization
2. Ensure proper typing with TypeScript
3. Keep components small and focused on a single responsibility
4. Use TailwindCSS for styling

## License

This project is proprietary and confidential.

## Contact

For more information, contact [info@harrpy.com](mailto:info@harrpy.com) 