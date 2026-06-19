# Architecture Documentation

## Table of Contents
- [System Overview](#system-overview)
- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Architecture](#data-architecture)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## System Overview

The Online Shop is a full-stack e-commerce application built with a modern microservices-oriented architecture. The system follows a clear separation of concerns with a RESTful backend API and a reactive frontend application.

**Core Business Capabilities:**
- User authentication and authorization
- Product catalog management with categories
- Shopping cart functionality
- Order processing with multi-location inventory management
- Stock management across multiple locations

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (Angular 21 + TailwindCSS)                │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST + JWT
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      API Gateway Layer                       │
│                   (Spring Boot 4.0.6)                        │
│                    Port: 3000 (/api)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐   ┌───────▼──────┐   ┌───────▼──────┐
│   Security   │   │   Business   │   │     Data     │
│    Layer     │   │    Layer     │   │    Layer     │
│              │   │              │   │              │
│ JWT Auth     │   │ Services     │   │ JPA/         │
│ Filters      │   │ Strategy     │   │ Hibernate    │
│ Guards       │   │ Pattern      │   │              │
└──────────────┘   └──────────────┘   └───────┬──────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │   PostgreSQL DB     │
                                    │   (Flyway managed)  │
                                    └─────────────────────┘
```

**Communication Flow:**
1. User interacts with Angular SPA
2. HTTP requests sent to Spring Boot API (port 3000/api)
3. JWT authentication filter validates tokens
4. Request routed to appropriate controller
5. Service layer applies business logic (including strategy pattern for order fulfillment)
6. Data layer persists/retrieves data from PostgreSQL
7. Response mapped to DTOs and returned to client

---

## Technology Stack

### Backend (onlineshopapi)
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Runtime environment |
| Spring Boot | 4.0.6 | Application framework |
| Spring Security | 4.x | Authentication & authorization |
| Spring Data JPA | 4.x | Data access layer |
| Hibernate | (via Spring Data) | ORM |
| PostgreSQL | Latest | Relational database |
| Flyway | Latest | Database migrations |
| JWT (JJWT) | 0.13.0 | Token-based authentication |
| Lombok | Latest | Boilerplate reduction |
| SpringDoc OpenAPI | 3.0.3 | API documentation |
| Testcontainers | 2.0.5 | Integration testing |
| Maven | Latest | Build tool |

### Frontend (onlineshopui)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 24.x | JavaScript runtime |
| Angular | 21.2 | Frontend framework |
| TypeScript | 5.9.2 | Type-safe JavaScript |
| TailwindCSS | 4.1.12 | Utility-first CSS |
| RxJS | 7.8.0 | Reactive programming |
| Lucide Angular | 0.577.0 | Icon library |
| Vitest | 4.0.8 | Testing framework |
| ESLint | 10.0.2 | Code linting |
| Prettier | 3.8.1 | Code formatting |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local development orchestration |

---

## Backend Architecture

The backend follows a layered architecture with clear separation of concerns, implementing Domain-Driven Design (DDD) principles.

### Directory Structure

```
onlineshopapi/
├── src/main/java/msg/onlineshopapi/
│   ├── config/                    # Application configuration
│   │   └── OpenApiConfig.java     # Swagger/OpenAPI setup
│   ├── controller/                # REST API endpoints
│   │   ├── AuthController.java
│   │   ├── OrderController.java
│   │   ├── ProductCategoryController.java
│   │   └── ProductController.java
│   ├── dto/                       # Data Transfer Objects
│   │   ├── mapper/                # MapStruct/manual mappers
│   │   └── [Request/Response DTOs]
│   ├── exception/                 # Exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   ├── DuplicateResourceException.java
│   │   ├── ResourceNotFoundException.java
│   │   └── OrderNotProcessableException.java
│   ├── model/                     # Domain entities (JPA)
│   │   ├── User.java
│   │   ├── Product.java
│   │   ├── ProductCategory.java
│   │   ├── Order.java
│   │   ├── OrderDetail.java
│   │   ├── Stock.java
│   │   ├── Location.java
│   │   └── Address.java
│   ├── repository/                # Data access layer
│   │   └── [JpaRepository implementations]
│   ├── security/                  # Security infrastructure
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthFilter.java
│   │   ├── JwtService.java
│   │   ├── JwtProperties.java
│   │   └── UserDetailsServiceImpl.java
│   ├── service/                   # Business logic layer
│   │   ├── AuthService.java
│   │   ├── OrderService.java
│   │   ├── ProductService.java
│   │   ├── ProductCategoryService.java
│   │   └── strategy/              # Strategy pattern implementations
│   │       ├── OrderStrategy.java
│   │       ├── OrderStrategyConfig.java
│   │       ├── SingleLocationStrategy.java
│   │       └── MostAbundantStrategy.java
│   └── OnlineShopApiApplication.java  # Application entry point
├── src/main/resources/
│   ├── application.yml            # Main configuration
│   ├── application-local.yml      # Local profile
│   └── db/migration/              # Flyway migrations
│       ├── V1__create_tables.sql
│       └── local/
│           └── V1.1__populate_mock_data.sql
└── src/test/                      # Test suites
    ├── java/msg/onlineshopapi/
    │   ├── controller/            # Controller tests
    │   ├── integration/           # Integration tests
    │   └── unit/service/          # Unit tests
    └── resources/
        └── application-test.yml
```

### Layer Responsibilities

#### 1. Controller Layer
**Location:** `controller/`
**Responsibility:** HTTP request handling, input validation, response mapping

**Key Controllers:**
- `AuthController` - User registration, login, token refresh
- `ProductController` - Product CRUD operations, search/filter
- `ProductCategoryController` - Category management
- `OrderController` - Order creation, retrieval, status management

**Patterns Used:**
- RESTful endpoint design
- Request/Response DTOs for API contracts
- Centralized exception handling via `@RestControllerAdvice`

#### 2. Service Layer
**Location:** `service/`
**Responsibility:** Business logic, transaction management, orchestration

**Key Services:**
- `AuthService` - Authentication logic, password hashing, JWT generation
- `ProductService` - Product business rules, inventory checks
- `OrderService` - Order processing, stock validation, order fulfillment strategy

**Notable Pattern: Strategy Pattern for Order Fulfillment**

The system implements a pluggable strategy pattern for order fulfillment from multiple warehouse locations:

```java
// Strategy interface
public interface OrderStrategy {
    Map<UUID, Location> determineShippingLocations(
        Map<UUID, Integer> productQuantities
    );
}

// Implementations
- SingleLocationStrategy: Ships all items from one location
- MostAbundantStrategy: Optimizes by shipping from locations with most stock
```

**Configuration:** Set via `app.order.strategy` property (SINGLE_LOCATION or MOST_ABUNDANT)

#### 3. Repository Layer
**Location:** `repository/`
**Responsibility:** Data access, query execution

**Key Repositories:**
- `UserRepository` - User queries including email lookups
- `ProductRepository` - Product search, filtering
- `OrderRepository` - Order persistence and retrieval
- `StockRepository` - Stock level queries across locations
- `LocationRepository` - Warehouse/location management

**Technology:** Spring Data JPA with custom JPQL queries where needed

#### 4. Security Layer
**Location:** `security/`
**Responsibility:** Authentication, authorization, JWT management

**Components:**
- `SecurityConfig` - Spring Security configuration, CORS, endpoint security
- `JwtAuthFilter` - Filter to validate JWT tokens on each request
- `JwtService` - Token generation, validation, claims extraction
- `UserDetailsServiceImpl` - Loads user details for authentication

**Security Flow:**
1. User authenticates via `/api/auth/login`
2. JWT token generated with user roles
3. Token included in `Authorization: Bearer <token>` header
4. `JwtAuthFilter` validates token on protected endpoints
5. User principal available in security context

#### 5. DTO Layer
**Location:** `dto/` and `dto/mapper/`
**Responsibility:** API contract definition, entity-DTO mapping

**DTO Types:**
- Request DTOs: `LoginRequestDto`, `RegisterRequestDto`, `OrderRequestDto`, etc.
- Response DTOs: `AuthResponseDto`, `ProductResponseDto`, `OrderResponseDto`, etc.
- Mappers: Manual mappers for entity ↔ DTO conversion

**Why DTOs:**
- Decouples internal domain model from API contract
- Controls data exposure (e.g., never expose password hashes)
- Allows API versioning without changing entities

### Exception Handling

**Global Exception Handler:** `GlobalExceptionHandler.java`

Custom exceptions:
- `ResourceNotFoundException` - 404 responses
- `DuplicateResourceException` - 409 conflicts
- `OrderNotProcessableException` - 422 unprocessable entity

All exceptions mapped to consistent error response structure.

### API Documentation

**Tool:** SpringDoc OpenAPI 3.0.3
**Access:** `/api/swagger-ui.html`
**Configuration:** `OpenApiConfig.java`

Provides interactive API documentation with request/response schemas and test capabilities.

---

## Frontend Architecture

The frontend follows a feature-based modular architecture with Angular 21, implementing reactive patterns and lazy-loading.

### Directory Structure

```
onlineshopui/
├── src/app/
│   ├── app.ts                     # Root component
│   ├── app.config.ts              # Application configuration
│   ├── app.routes.ts              # Root routing
│   ├── clib/                      # Component library (shared UI)
│   │   ├── components/
│   │   │   ├── card/
│   │   │   ├── error-message/
│   │   │   ├── icon/
│   │   │   ├── modal/
│   │   │   ├── navbar/
│   │   │   ├── notification-popup/
│   │   │   └── spinner/
│   │   ├── layouts/
│   │   │   └── root-layout/      # Main application layout
│   │   └── services/
│   │       └── theme.service.ts  # Theme management
│   ├── core/                      # Core functionality (singleton services)
│   │   ├── config/
│   │   │   └── constants/        # Application constants
│   │   ├── mocks/                # Mock data and interceptors
│   │   │   ├── data/
│   │   │   └── interceptors/
│   │   ├── providers/            # Dependency injection providers
│   │   ├── services/
│   │   │   └── notifications.service.ts
│   │   └── types/                # TypeScript types and DTOs
│   │       ├── dtos/
│   │       ├── enums/
│   │       └── providers/
│   └── features/                  # Feature modules (lazy-loaded)
│       ├── auth/
│       │   ├── components/
│       │   │   ├── login-page/
│       │   │   └── register-page/
│       │   ├── directives/
│       │   │   └── has-role.directive.ts
│       │   ├── guards/
│       │   │   ├── auth.guard.ts
│       │   │   ├── guest.guard.ts
│       │   │   └── roles.guard.ts
│       │   ├── interceptors/
│       │   │   └── auth-token.interceptor.ts
│       │   ├── services/
│       │   │   └── auth.service.ts
│       │   ├── utils/
│       │   └── auth.routes.ts
│       ├── products/
│       │   ├── components/
│       │   ├── services/
│       │   └── products.routes.ts
│       ├── cart/
│       │   ├── components/
│       │   ├── services/
│       │   └── cart.routes.ts
│       └── orders/
│           ├── components/
│           ├── services/
│           └── orders.routes.ts
├── angular.json                   # Angular CLI configuration
├── package.json                   # Dependencies
├── tailwind.config.js             # TailwindCSS configuration
└── tsconfig.json                  # TypeScript configuration
```

### Architecture Layers

#### 1. Core Module
**Location:** `core/`
**Responsibility:** Singleton services, application-wide configuration, global state

**Key Components:**
- **Constants:** Navigation routes, validation rules, icon mappings
- **Services:** Notifications service for app-wide toasts/alerts
- **Types:** Shared TypeScript interfaces and DTOs matching backend API
- **Providers:** Dependency injection configuration for environment, validation messages
- **Mocks:** Mock API interceptor for local development without backend

**Characteristics:**
- Imported once in `app.config.ts`
- Services are singleton across the app
- No feature-specific logic

#### 2. Shared Component Library (clib)
**Location:** `clib/`
**Responsibility:** Reusable UI components, layouts, utilities

**Components:**
- `card` - Product/content card component
- `error-message` - Form validation error display
- `icon` - Icon wrapper (Lucide icons)
- `modal` - Modal dialog component
- `navbar` - Top navigation bar
- `notification-popup` - Toast notification component
- `spinner` - Loading spinner

**Layouts:**
- `root-layout` - Main application shell with navbar and outlet

**Services:**
- `theme.service` - Dark/light mode management

**Design System:**
- Built with TailwindCSS utility classes
- Consistent spacing, colors, typography
- Responsive design patterns

#### 3. Feature Modules
**Location:** `features/`
**Responsibility:** Business functionality organized by domain

Each feature module is **lazy-loaded** for optimal performance.

##### Auth Feature
**Purpose:** User authentication and authorization

**Components:**
- `login-page` - User login form
- `register-page` - User registration form

**Services:**
- `auth.service` - Authentication API calls, token management, user state

**Guards:**
- `auth.guard` - Protects routes requiring authentication
- `guest.guard` - Redirects authenticated users (e.g., login page)
- `roles.guard` - Role-based access control

**Directives:**
- `has-role.directive` - Conditionally show/hide elements based on user role

**Interceptors:**
- `auth-token.interceptor` - Automatically adds JWT token to outgoing requests

**State Management:**
- Tokens stored in localStorage
- User state managed via BehaviorSubject in AuthService
- Reactive authentication state observable

##### Products Feature
**Purpose:** Product catalog browsing

**Components:**
- Product list/grid views
- Product detail pages
- Category filters
- Search functionality

**Services:**
- Product API integration
- Category management
- Product filtering/sorting logic

##### Cart Feature
**Purpose:** Shopping cart management

**Components:**
- Cart overview page
- Cart item components
- Quantity controls

**Services:**
- Cart state management
- Add/remove/update cart items
- Cart persistence (localStorage)

##### Orders Feature
**Purpose:** Order creation and history

**Components:**
- Order checkout flow
- Address input forms
- Order confirmation
- Order history list

**Services:**
- Order API integration
- Order state management

### Routing Strategy

**Root Routes:** `app.routes.ts`

```typescript
/auth/*              → Auth module (public, guest guard)
  /login
  /register

/                    → Root layout (protected by auth guard)
  /products/*        → Products module
  /cart/*            → Cart module
  /orders/*          → Orders module

/**                  → Redirect to /products/overview
```

**Lazy Loading:**
All feature modules loaded on-demand using Angular's `loadChildren`:

```typescript
loadChildren: () => import('./features/auth/auth.routes')
    .then(mod => mod.AuthRoutes)
```

**Benefits:**
- Smaller initial bundle size
- Faster first page load
- Modules loaded only when accessed

### State Management

**Approach:** Reactive state with RxJS

**Patterns:**
1. **Service-based state** - Each feature service manages its own state using BehaviorSubject
2. **Observable streams** - Components subscribe to state changes
3. **Immutable updates** - State updates create new objects (spread operator)

**Example (AuthService):**
```typescript
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();
```

Components subscribe to `currentUser$` for reactive updates.

### HTTP Communication

**API Base URL:** Configured via environment providers

**Interceptors:**
1. `auth-token.interceptor` - Adds JWT to Authorization header
2. `mock-api.interceptor` - Intercepts requests for mock development (dev only)

**Error Handling:**
- HTTP errors caught in services
- Translated to user-friendly messages
- Displayed via NotificationsService

### Forms

**Approach:** Reactive Forms (Angular FormBuilder)

**Validation:**
- Built-in validators (required, email, minLength, etc.)
- Custom validators for business rules
- Error messages configured via validation providers
- Real-time validation feedback

**Utils:**
- Form builders in `utils/` (e.g., `login-form.utils.ts`)
- Reusable form field configurations

### Styling Architecture

**Framework:** TailwindCSS 4.1.12

**Approach:**
- Utility-first CSS classes
- Custom design tokens in `tailwind.config.js`
- Dark mode support via `theme.service`
- Responsive breakpoints

**Benefits:**
- Rapid UI development
- Consistent design system
- Small production CSS bundle (purged unused classes)
- No CSS naming conflicts

---

## Data Architecture

### Database Schema

**Database:** PostgreSQL
**Schema Management:** Flyway migrations
**ORM:** Hibernate via Spring Data JPA

### Entity Relationship Diagram

```
┌─────────────────────┐
│  product_categories │
│                     │
│  PK: id (UUID)      │
│      name           │
│      description    │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐          ┌─────────────────────┐
│      products       │          │     locations       │
│                     │          │                     │
│  PK: id (UUID)      │          │  PK: id (UUID)      │
│      name           │          │      name           │
│      description    │          │      country        │
│      price          │          │      city           │
│      weight         │          │      county         │
│  FK: category_id    │          │      street_address │
│      image_url      │          └──────────┬──────────┘
└──────────┬──────────┘                     │
           │                                │
           │ N:M                            │
           │ (via stocks)                   │
           │                                │
┌──────────▼────────────────────────────────▼──┐
│              stocks                          │
│                                              │
│  PK: (product_id, location_id)              │
│  FK: product_id → products                  │
│  FK: location_id → locations                │
│      quantity                                │
└──────────────────────────────────────────────┘

┌─────────────────────┐
│       users         │
│                     │
│  PK: id (UUID)      │
│      first_name     │
│      last_name      │
│      email (unique) │
│      password       │
│      role           │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│       orders        │
│                     │
│  PK: id (UUID)      │
│  FK: user_id        │
│      created_at     │
│      country        │
│      city           │
│      county         │
│      street_address │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│   order_details     │
│                     │
│  PK: (order_id,     │
│       product_id)   │
│  FK: order_id       │
│  FK: product_id     │
│  FK: shipped_from_id│
│      quantity       │
└─────────────────────┘
```

### Table Details

#### product_categories
**Purpose:** Product classification
**Key Columns:**
- `id` (UUID) - Primary key
- `name` - Category name
- `description` - Category description

**Relationships:**
- One-to-many with `products`

#### products
**Purpose:** Product catalog
**Key Columns:**
- `id` (UUID) - Primary key
- `name` - Product name
- `description` - Product description
- `price` (DECIMAL) - Product price
- `weight` (DOUBLE) - Product weight for shipping
- `category_id` (UUID) - Foreign key to category
- `image_url` - Product image URL

**Relationships:**
- Many-to-one with `product_categories`
- Many-to-many with `locations` via `stocks`
- One-to-many with `order_details`

#### locations
**Purpose:** Warehouse/fulfillment centers
**Key Columns:**
- `id` (UUID) - Primary key
- `name` - Location name
- `country`, `city`, `county`, `street_address` - Location address

**Relationships:**
- Many-to-many with `products` via `stocks`
- One-to-many with `order_details` (shipped_from)

#### stocks
**Purpose:** Inventory levels per location
**Composite Key:** `(product_id, location_id)`
**Key Columns:**
- `product_id` (UUID) - Foreign key to product
- `location_id` (UUID) - Foreign key to location
- `quantity` (INTEGER) - Available stock quantity

**Business Rules:**
- Each product can be stocked at multiple locations
- Stock levels checked before order fulfillment
- Updated when orders are placed

#### users
**Purpose:** User accounts
**Key Columns:**
- `id` (UUID) - Primary key
- `first_name`, `last_name` - User name
- `email` (VARCHAR, UNIQUE) - Login identifier
- `password` (VARCHAR) - Hashed password
- `role` (VARCHAR) - User role (ADMIN, CUSTOMER)

**Security:**
- Password stored as bcrypt hash
- Email uniqueness enforced at DB level
- Role-based authorization

**Relationships:**
- One-to-many with `orders`

#### orders
**Purpose:** Customer orders
**Key Columns:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to user
- `created_at` (TIMESTAMP) - Order creation time
- `country`, `city`, `county`, `street_address` - Shipping address

**Relationships:**
- Many-to-one with `users`
- One-to-many with `order_details`

#### order_details
**Purpose:** Order line items
**Composite Key:** `(order_id, product_id)`
**Key Columns:**
- `order_id` (UUID) - Foreign key to order
- `product_id` (UUID) - Foreign key to product
- `shipped_from_id` (UUID) - Foreign key to location (warehouse)
- `quantity` (INTEGER) - Ordered quantity

**Business Rules:**
- Tracks which location ships each product
- Determined by order fulfillment strategy
- Quantity must not exceed available stock at fulfillment time

### Migration Strategy

**Tool:** Flyway
**Location:** `src/main/resources/db/migration/`

**Migrations:**
- `V1__create_tables.sql` - Initial schema creation
- `V1.1__populate_mock_data.sql` (local profile) - Test data

**Process:**
1. Flyway runs on application startup
2. Tracks applied migrations in `flyway_schema_history` table
3. Only new migrations executed
4. Migrations are immutable (never modify applied migrations)

**Configuration:**
```yaml
spring:
  flyway:
    schemas: public
  jpa:
    hibernate:
      ddl-auto: validate  # Ensures schema matches entities
```

### Data Integrity

**Constraints:**
- Primary keys on all tables (UUID)
- Foreign key constraints enforce referential integrity
- Unique constraint on `users.email`
- NOT NULL constraints on critical fields

**Transactions:**
- Service layer methods transactional by default (`@Transactional`)
- Order creation is atomic (order + order_details + stock updates)
- Rollback on any failure in transaction

---

## Security Architecture

### Authentication Flow

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│  Client  │                 │   API    │                 │    DB    │
└────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                            │                            │
     │  1. POST /api/auth/login   │                            │
     │  {email, password}         │                            │
     ├───────────────────────────>│                            │
     │                            │                            │
     │                            │  2. Query user by email    │
     │                            ├───────────────────────────>│
     │                            │                            │
     │                            │  3. Return user + hash     │
     │                            │<───────────────────────────┤
     │                            │                            │
     │                            │  4. Verify password        │
     │                            │     (BCrypt compare)       │
     │                            │                            │
     │                            │  5. Generate JWT           │
     │                            │     (claims: id, email,    │
     │                            │      role, expiry)         │
     │                            │                            │
     │  6. Return JWT token       │                            │
     │<───────────────────────────┤                            │
     │  {token, user info}        │                            │
     │                            │                            │
     │  7. Store token in         │                            │
     │     localStorage           │                            │
     │                            │                            │
     │  8. GET /api/products      │                            │
     │  Header: Authorization:    │                            │
     │    Bearer <JWT>            │                            │
     ├───────────────────────────>│                            │
     │                            │                            │
     │                            │  9. JwtAuthFilter          │
     │                            │     - Extract token        │
     │                            │     - Validate signature   │
     │                            │     - Check expiry         │
     │                            │     - Load user details    │
     │                            │     - Set SecurityContext  │
     │                            │                            │
     │                            │ 10. Process request        │
     │                            │                            │
     │ 11. Return response        │                            │
     │<───────────────────────────┤                            │
     │                            │                            │
```

### Security Components

#### Backend Security

**JWT Configuration:**
```yaml
app:
  jwt:
    secret: ${JWT_SECRET}      # HS256 signing key
    expiration: 86400000       # 24 hours in milliseconds
```

**Security Filter Chain:**
1. CORS filter (allow configured origins)
2. JWT authentication filter (`JwtAuthFilter`)
3. Spring Security authorization

**Endpoint Security:**
- `/api/auth/**` - Public (login, register)
- `/api/products/**` - Protected (requires authentication)
- `/api/orders/**` - Protected (requires authentication)
- `/api/categories/**` - Protected (requires authentication)

**Password Hashing:**
- Algorithm: BCrypt
- Work factor: Default Spring Security settings (10 rounds)
- Configured in `SecurityConfig`

**CORS Configuration:**
```yaml
app:
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS}  # e.g., http://localhost:4200
```

#### Frontend Security

**Token Management:**
- JWT stored in `localStorage` (key: `auth_token`)
- Token included in all API requests via `AuthTokenInterceptor`
- Token validated on app initialization

**Route Protection:**
- `AuthGuard` - Blocks unauthenticated access to protected routes
- `GuestGuard` - Redirects authenticated users from auth pages
- `RolesGuard` - Role-based route access (ADMIN, CUSTOMER)

**Authorization Directive:**
```typescript
<button *hasRole="'ADMIN'">Admin Only</button>
```

**Security Best Practices:**
- No sensitive data in localStorage (only JWT)
- Automatic logout on token expiry
- HTTP-only cookies considered for future enhancement
- XSS protection via Angular's built-in sanitization

### Threat Mitigation

| Threat | Mitigation |
|--------|-----------|
| SQL Injection | Parameterized queries via JPA/Hibernate |
| XSS | Angular's built-in sanitization, Content-Security-Policy headers |
| CSRF | Stateless JWT (no cookies), CORS restrictions |
| Password Attacks | BCrypt hashing, password strength validation |
| Session Hijacking | Short token expiry (24h), HTTPS in production |
| Unauthorized Access | JWT validation, route guards, role-based access control |
| Mass Assignment | DTOs decouple API from entities, explicit field mapping |
| Information Disclosure | Exception handling returns generic messages, no stack traces to client |

---

## Deployment Architecture

### Local Development Environment

**Setup:** Docker Compose
**Location:** `docker/development/docker-compose.yml`

**Services:**
1. **PostgreSQL Database**
   - Port: 5432
   - Initial database, user, and password configured

2. **Backend (Spring Boot)**
   - Port: 3000
   - Context path: `/api`
   - Connects to PostgreSQL
   - Flyway migrations run on startup

3. **Frontend (Angular)**
   - Port: 4200
   - Proxies API calls to backend (port 3000)

**Environment Variables:**
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=onlineshop
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Security
JWT_SECRET=<secret-key>
CORS_ALLOWED_ORIGINS=http://localhost:4200

# Order Strategy
app.order.strategy=SINGLE_LOCATION
```

### Build Process

#### Backend Build
```bash
cd onlineshopapi
mvn clean package
# Output: target/onlineshopapi-0.0.1-SNAPSHOT.jar
```

**Build Artifacts:**
- Executable Spring Boot JAR (fat JAR with embedded Tomcat)
- Includes all dependencies

**Maven Profiles:**
- `local` - Local development (mock data migrations)
- `test` - Test environment (Testcontainers)
- `production` - Production build (no mock data)

#### Frontend Build
```bash
cd onlineshopui
npm install
npm run build
# Output: dist/onlineshopui/
```

**Build Configurations:**
- `development` - Dev build (source maps, verbose errors)
- `production` - Optimized build (minified, tree-shaken, AOT compiled)

**Build Optimizations:**
- Ahead-of-Time (AOT) compilation
- Tree-shaking (removes unused code)
- Lazy-loading modules
- TailwindCSS purging (removes unused styles)

### Testing Strategy

#### Backend Tests

**Unit Tests:**
- Location: `src/test/java/.../unit/`
- Framework: JUnit 5, Mockito
- Target: Service layer business logic
- Run: `mvn test`

**Integration Tests:**
- Location: `src/test/java/.../integration/`
- Framework: Spring Boot Test, Testcontainers
- Target: Full request-response cycle with real database
- Database: PostgreSQL in Docker container (Testcontainers)
- Run: `mvn verify`

**Controller Tests:**
- Location: `src/test/java/.../controller/`
- Framework: MockMvc, Spring Security Test
- Target: HTTP endpoints, request validation, security
- Run: `mvn test`

**Test Configuration:**
- `application-test.yml` - Test-specific config
- `TestSecurityConfig.java` - Security config for tests

#### Frontend Tests

**Unit Tests:**
- Framework: Vitest 4.0.8
- Target: Services, utilities, guards, interceptors
- Run: `npm test`

**Component Tests:**
- Framework: Vitest + Angular Testing Library
- Target: Component logic, user interactions
- Run: `npm test`

**Linting:**
- ESLint for TypeScript/JavaScript
- Run: `npm run lint`

**Formatting:**
- Prettier for code formatting
- Run: `npm run format`

### Production Deployment Considerations

**Backend:**
- Deploy as Docker container or standalone JAR
- External PostgreSQL database (managed service recommended)
- Environment-specific `application-{profile}.yml`
- Logging configured for production (log levels, appenders)
- Health check endpoint: `/api/actuator/health` (if Spring Actuator enabled)

**Frontend:**
- Build production bundle: `npm run build`
- Serve via Nginx, Apache, or CDN
- Environment-specific API base URL
- HTTPS enforced
- Caching headers for static assets

**Database:**
- PostgreSQL 14+ recommended
- Connection pooling (HikariCP via Spring Boot)
- Regular backups
- Monitoring query performance

**Security:**
- HTTPS/TLS for all traffic
- Environment variables for secrets (never commit secrets)
- JWT secret rotation policy
- Database credentials secured (e.g., AWS Secrets Manager)
- Rate limiting on API endpoints
- WAF (Web Application Firewall) recommended

**Monitoring:**
- Application logs (structured logging recommended)
- Database query metrics
- API response times
- Error tracking (e.g., Sentry)
- Uptime monitoring

---

## Design Patterns & Principles

### Backend Patterns

1. **Layered Architecture**
   - Clear separation: Controller → Service → Repository → Database
   - Each layer has single responsibility

2. **Strategy Pattern**
   - Order fulfillment strategies (SingleLocationStrategy, MostAbundantStrategy)
   - Allows runtime selection of fulfillment algorithm

3. **DTO Pattern**
   - Decouples API contract from domain model
   - Mappers handle conversions

4. **Repository Pattern**
   - Data access abstraction via Spring Data JPA
   - Query methods defined by naming convention

5. **Dependency Injection**
   - Spring IoC container manages dependencies
   - Constructor injection for required dependencies

6. **Exception Translation**
   - Domain exceptions translated to HTTP status codes
   - GlobalExceptionHandler provides consistent error responses

### Frontend Patterns

1. **Feature Modules**
   - Domain-driven code organization
   - Lazy-loading for performance

2. **Observable Streams**
   - RxJS for reactive state management
   - Async data flow via Observables

3. **Service Facade**
   - Feature services encapsulate API calls and state
   - Components delegate business logic to services

4. **Guard Pattern**
   - Route guards control navigation
   - Authentication and authorization enforced declaratively

5. **Interceptor Pattern**
   - Cross-cutting concerns (auth token, logging, error handling)
   - Applied transparently to HTTP requests

6. **Smart/Dumb Components**
   - Smart (container) components manage state
   - Dumb (presentational) components receive data via inputs

### Principles

- **SOLID Principles**
  - Single Responsibility: Each class has one reason to change
  - Open/Closed: Open for extension (strategy pattern), closed for modification
  - Liskov Substitution: Strategy implementations interchangeable
  - Interface Segregation: Focused interfaces (OrderStrategy, JpaRepository)
  - Dependency Inversion: Depend on abstractions (interfaces), not concrete classes

- **DRY (Don't Repeat Yourself)**
  - Shared components in `clib/`
  - Reusable services in `core/`
  - Mappers eliminate repetitive conversion code

- **Separation of Concerns**
  - Backend layers have distinct responsibilities
  - Frontend features isolated from each other

- **Convention over Configuration**
  - Spring Boot auto-configuration
  - Angular conventions (routing, dependency injection)

---

## API Contract

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://<domain>/api`

### Authentication Endpoints

#### POST /auth/register
**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN"
  }
}
```

#### POST /auth/login
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "CUSTOMER | ADMIN"
  }
}
```

### Product Endpoints

#### GET /products
**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "price": "number",
    "weight": "number",
    "imageUrl": "string",
    "category": {
      "id": "uuid",
      "name": "string"
    }
  }
]
```

#### GET /products/{id}
**Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "number",
  "weight": "number",
  "imageUrl": "string",
  "category": {
    "id": "uuid",
    "name": "string"
  }
}
```

### Order Endpoints

#### POST /orders
**Request:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": "number"
    }
  ],
  "address": {
    "country": "string",
    "city": "string",
    "county": "string",
    "streetAddress": "string"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "createdAt": "timestamp",
  "address": {
    "country": "string",
    "city": "string",
    "county": "string",
    "streetAddress": "string"
  },
  "items": [
    {
      "product": {
        "id": "uuid",
        "name": "string",
        "price": "number"
      },
      "quantity": "number",
      "shippedFrom": {
        "id": "uuid",
        "name": "string"
      }
    }
  ]
}
```

#### GET /orders
**Response (200):**
```json
[
  {
    "id": "uuid",
    "createdAt": "timestamp",
    "address": { /* address object */ },
    "items": [ /* order items */ ]
  }
]
```

### Error Responses

**Standard Error Format:**
```json
{
  "status": "number (HTTP status code)",
  "message": "string (error description)",
  "timestamp": "timestamp"
}
```

**Common Status Codes:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid JWT
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email already exists)
- `422 Unprocessable Entity` - Business logic error (e.g., insufficient stock)
- `500 Internal Server Error` - Unexpected server error

---

## Configuration Management

### Backend Configuration

**Primary Config:** `src/main/resources/application.yml`

**Profiles:**
- `local` - Local development (`application-local.yml`)
- `test` - Test environment (`application-test.yml`)
- `production` - Production deployment (environment variables)

**Externalized Configuration:**
- Environment variables for sensitive data (DB credentials, JWT secret)
- System properties for deployment-specific settings
- Spring Cloud Config Server for centralized config (future enhancement)

**Configuration Hierarchy:**
1. Environment variables (highest priority)
2. Profile-specific YAML (`application-{profile}.yml`)
3. Default YAML (`application.yml`)

### Frontend Configuration

**Environment Configuration:**
- Environment providers in `core/providers/environment-config.provider.ts`
- API base URL configured per environment
- Mock API toggle for development

**Angular Configurations:**
- `angular.json` - Build configurations, asset paths
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Design system tokens

---

## Future Enhancements

### Planned Features
1. **Payment Integration** - Stripe/PayPal integration for checkout
2. **Order Tracking** - Real-time order status updates
3. **Product Reviews** - User ratings and reviews
4. **Wishlist** - Save products for later
5. **Admin Dashboard** - Product/order management UI
6. **Email Notifications** - Order confirmations, shipping updates
7. **Search** - Full-text search for products
8. **Pagination** - Product list pagination for large catalogs

### Technical Improvements
1. **Caching** - Redis for product catalog caching
2. **CDN** - Static asset delivery via CDN
3. **Observability** - Distributed tracing (OpenTelemetry), metrics (Prometheus)
4. **CI/CD** - Automated testing and deployment pipelines
5. **API Versioning** - Support multiple API versions
6. **GraphQL** - Alternative API for flexible querying
7. **Microservices** - Split into separate services (catalog, orders, auth)
8. **Event-Driven Architecture** - Message broker (RabbitMQ/Kafka) for async operations

---

## Appendix

### Key Files Reference

| File | Purpose |
|------|---------|
| `onlineshopapi/pom.xml` | Backend dependencies and build config |
| `onlineshopapi/src/main/resources/application.yml` | Backend configuration |
| `onlineshopapi/src/main/resources/db/migration/V1__create_tables.sql` | Database schema |
| `onlineshopui/package.json` | Frontend dependencies |
| `onlineshopui/angular.json` | Angular CLI configuration |
| `onlineshopui/src/app/app.routes.ts` | Frontend routing |
| `docker/development/docker-compose.yml` | Local environment setup |

### Glossary

- **DTO** - Data Transfer Object: Object for API data transfer
- **JPA** - Java Persistence API: Java ORM specification
- **JWT** - JSON Web Token: Stateless authentication token
- **ORM** - Object-Relational Mapping: Database abstraction layer
- **SPA** - Single Page Application: Client-side rendered web app
- **UUID** - Universally Unique Identifier: 128-bit unique ID
- **BCrypt** - Password hashing algorithm
- **CORS** - Cross-Origin Resource Sharing: Browser security policy
- **AOT** - Ahead-of-Time compilation: Angular pre-compilation

---

**Document Version:** 1.0
**Last Updated:** 2026-06-19
**Maintained By:** Development Team
