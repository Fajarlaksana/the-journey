# TheJourney – Automotive Modification Media Platform

A modern, high-performance automotive media platform for showcasing modified cars from automotive events.

## Features

### Public Website
- **Homepage** – Hero section, featured builds, car of the month, latest event builds, trending builds
- **Car Builds** – Browse all builds with search and filters (brand, category, event)
- **Car Detail Pages** – Full gallery (6 images), specifications, awards, related builds
- **Event Timeline** – Browse events by year, view all cars from each event
- **SEO Optimized** – Metadata, OpenGraph, structured data, sitemap.xml, robots.txt

### Admin Dashboard
- **Authentication** – Secure login with NextAuth
- **Dashboard** – Overview with stats and recent builds
- **Car Management** – CRUD operations for car builds
- **Image Upload** – Drag & drop upload, exactly 6 images per car
- **Event Management** – Manage automotive events
- **Brand Management** – Manage car brands
- **Category Management** – Manage modification categories
- **Award Management** – Manage event awards

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **UI Components**: Radix UI, shadcn/ui patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd thejourney
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/thejourney?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

After running the seed script:
- **Email**: `admin@thejourney.com`
- **Password**: `admin123`

**⚠️ Change the default password in production!**

## Project Structure

```
thejourney/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
├── public/
│   └── uploads/            # Uploaded images
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── builds/         # Public car build pages
│   │   ├── events/         # Public event pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── sitemap.ts      # Dynamic sitemap
│   │   └── robots.ts       # Robots.txt
│   ├── components/
│   │   ├── admin/          # Admin components
│   │   ├── builds/         # Build-related components
│   │   ├── cars/           # Car display components
│   │   ├── events/         # Event components
│   │   ├── homepage/       # Homepage sections
│   │   ├── navigation/     # Navbar & Footer
│   │   └── ui/             # UI components
│   └── lib/
│       ├── prisma.ts       # Prisma client
│       └── utils.ts        # Utility functions
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Database Schema

### Tables

- **User** – Admin users
- **Event** – Automotive events (name, year, location)
- **Brand** – Car brands (Toyota, Nissan, BMW, etc.)
- **Category** – Modification categories (JDM, Stance, Track, etc.)
- **Award** – Event awards (Winner, Best Engine, etc.)
- **Car** – Car builds with specifications
- **CarImage** – Images for each car (exactly 6 per car)

### Relationships

- Event → has many → Cars
- Car → belongs to → Brand
- Car → belongs to → Category
- Car → belongs to → Event
- Car → may have → Award
- Car → has many → CarImages (6 images)

## API Endpoints

### Public
- `GET /api/cars` – List all published cars
- `GET /api/cars/[slug]` – Get car details
- `GET /api/events` – List all events
- `GET /api/events/[slug]` – Get event details

### Admin (Protected)
- `POST /admin/api/cars` – Create car
- `DELETE /admin/api/cars/[id]` – Delete car
- `PATCH /admin/api/cars/[id]/toggle` – Toggle publish status
- `POST /admin/api/upload` – Upload image
- `DELETE /admin/api/events/[id]` – Delete event
- `DELETE /admin/api/brands/[id]` – Delete brand
- `DELETE /admin/api/categories/[id]` – Delete category
- `DELETE /admin/api/awards/[id]` – Delete award

## Design Features

### Visual Style
- Dark theme with red accent colors
- Large automotive photography
- Minimal UI with editorial layout
- Strong typography (Inter + Oswald fonts)
- Clean spacing and subtle animations

### Animations
- Page transitions with Framer Motion
- Hover effects on cards and buttons
- Image reveal animations
- Smooth scroll effects
- Gallery transitions

### Performance
- Next.js Image optimization
- Lazy loading for images
- Server-side rendering
- Static generation for car pages
- Minimal JavaScript bundle

## SEO Features

- Next.js Metadata API
- OpenGraph tags for social sharing
- Twitter cards
- Structured data (JSON-LD)
- Semantic HTML
- Dynamic sitemap.xml
- Robots.txt configuration

## Security

- Secure authentication with NextAuth
- Protected admin routes
- Input validation
- File upload validation
- SQL injection prevention (Prisma ORM)
- XSS protection

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed initial data
```

## Production Deployment

### Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key
```

### Recommended Hosting

- **Vercel** – Best for Next.js applications
- **Railway** – For PostgreSQL database
- **Supabase** – Alternative for PostgreSQL

### Build Command

```bash
npm run build
```

### Start Command

```bash
npm run start
```

## License

MIT License – feel free to use this project for your automotive media platform.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ for car enthusiasts worldwide.
