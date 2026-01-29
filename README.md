# GYT Admin

A modern admin dashboard built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Charting library

## Project Structure

```
gyt_admin/
├── src/
│   ├── core/                 # Core application files
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components (Atomic Design)
│   │   │   ├── atoms/       # Basic building blocks
│   │   │   ├── molecules/   # Simple component groups
│   │   │   ├── organisms/   # Complex components
│   │   │   └── templates/   # Page templates
│   │   ├── config/          # Configuration files
│   │   ├── layouts/         # Layout components
│   │   ├── routes/          # Routing configuration
│   │   ├── services/        # API services
│   │   └── styles/          # Global styles
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── users/          # User management
│   │   └── ...             # Other features
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gyt_admin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.staging .env
```

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:staging` - Build for staging environment
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import Button from '@/core/components/atoms/Button';
import { useAuth } from '@features/auth';
```

Available aliases:
- `@/*` → `src/*`
- `@core/*` → `src/core/*`
- `@features/*` → `src/features/*`

## Architecture

### Atomic Design

Components are organized using Atomic Design principles:

- **Atoms**: Basic UI elements (Button, Input, Label)
- **Molecules**: Simple component combinations (InputField, SearchBar)
- **Organisms**: Complex UI sections (Navbar, DataTable, Sidebar)
- **Templates**: Page layouts (TablePageTemplate, AuthTemplate)

### Feature-Based Structure

Features are self-contained modules with their own:
- Components
- Pages
- Services
- Hooks
- Context

## TypeScript

This project uses TypeScript for type safety. Common types are defined in `src/types/index.ts`.

### Adding Types

```typescript
// Define component props
interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// Use in component
const MyComponent: React.FC<MyComponentProps> = ({ title, onSubmit }) => {
  // ...
};
```

## Environment Variables

Create a `.env` file based on `.env.staging`:

```env
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=GYT Admin
VITE_APP_VERSION=1.0.0
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking: `npm run type-check`
4. Run linting: `npm run lint`
5. Submit a pull request

## License

[Your License Here]
