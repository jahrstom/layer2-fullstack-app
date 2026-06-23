# Online Shop UI - Angular Frontend

Angular 21 standalone components app with TailwindCSS 4, JWT auth, and lazy-loaded features.

## Quick Start

Development server:
```bash
npm install
npm start
```
UI: http://localhost:4200

**Mock mode** (no backend required):
```bash
npm run start:mock
```

## Testing

Vitest with jsdom:
```bash
npm test
```

## Architecture

**Module organization:**
- `src/app/core/` - Singletons (services, guards, interceptors, types)
- `src/app/features/` - Lazy-loaded features (auth, cart, orders, products)
- `src/app/clib/` - Reusable UI components (Card, Modal, Navbar, etc.)
- `src/environments/` - Environment-specific config

**Features:**
- `auth/` - Login, registration (JWT stored in session storage)
- `cart/` - Shopping cart with local storage persistence
- `orders/` - Order history and details
- `products/` - Product catalog, details, CRUD (admin)

**Component library (clib/):**
- 8 reusable UI components: Card, Modal, Navbar, Icon, Spinner, ErrorMessage, NotificationPopup
- `layouts/` - Page layout templates (root-layout)
- Total: 22 components project-wide (8 shared, 14 in features)

## Component Organization

Each feature uses:
- `components/pages/` - Routed page components (container logic)
- `components/views/` - Presentational sub-components

**Example:** products feature
- Pages: product-catalog-page, product-detail-page, product-create-page, product-update-page
- Views: product-card, product-form

## State Management

**Patterns:**
- RxJS subjects for reactive state
- Local storage for cart persistence
- Session storage for JWT token
- Services in feature modules manage state

**Example:** Cart state in `features/cart/services/`

## HTTP Layer

**Interceptors** (`core/providers/`):
- JWT injection on API requests
- Error handling

**Base URL:**
- Configured in `environments/environment.ts`
- Default: http://localhost:3000/api

**Mock mode:**
- Uses `core/mocks/` for API responses
- Enabled via `start:mock` script

## Styling

**TailwindCSS 4:**
- Configuration in project root
- Utility-first approach
- Custom styles in component directories

**Icons:**
- Lucide Angular icon library

## Code Generation

Angular CLI scaffolding:
```bash
ng generate component features/products/components/pages/my-page
ng generate service features/products/services/my-service
```

See `ng generate --help` for all available schematics.

## Build

Development build:
```bash
ng build
```

Production build (optimized):
```bash
ng build --configuration production
```

Output: `dist/` directory

## Common Patterns

**Standalone components:**
- All components use standalone pattern (no NgModules)
- Import dependencies directly in component metadata

**Lazy loading:**
- Features loaded on-demand via router
- Improves initial load time

**HTTP services:**
- Feature-specific services make API calls
- Return observables for reactive handling

**Guards:**
- Auth guards in `core/providers/` protect routes
- Check JWT token validity

## Gotchas

- Backend context path is `/api` - all API calls need this prefix
- JWT tokens expire after 24h - handle 401 responses
- Mock mode serves static data from `core/mocks/`
- Cart state persists in local storage - clear manually if needed
- Session storage used for JWT (not local storage) - clears on tab close
- TailwindCSS 4 config differs from v3 - check official migration guide
- Node.js 24 required (specified in package.json engines)
