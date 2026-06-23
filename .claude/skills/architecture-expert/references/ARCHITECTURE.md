# Architecture

Full-stack e-commerce application enabling product browsing, cart management, and order placement with JWT authentication.

## System Overview

Three-tier architecture with Angular 21 frontend, Spring Boot 4 backend, and PostgreSQL 18 database. Services communicate via REST API with JWT-based authentication.

```
┌─────────────────────┐
│   Angular UI        │  Port 4200
│   (onlineshopui)    │  
└──────────┬──────────┘
           │ HTTP/REST
           │ JWT Auth
┌──────────▼──────────┐
│  Spring Boot API    │  Port 3000
│  (onlineshopapi)    │  Context: /api
└──────────┬──────────┘
           │ JDBC
┌──────────▼──────────┐
│   PostgreSQL DB     │  Port 5433
└─────────────────────┘
```

## Technology Stack

**Frontend (onlineshopui/)**
- Angular 21 with standalone components
- TailwindCSS 4 for styling
- Lucide Angular for icons
- RxJS for reactive state
- Vitest for testing

**Backend (onlineshopapi/)**
- Spring Boot 4.0.6
- Java 21
- Spring Security with JWT (JJWT 0.13.0)
- Spring Data JPA
- Flyway for migrations
- SpringDoc OpenAPI 3.0.3
- Testcontainers 2.0.5

**Database**
- PostgreSQL 18
- Flyway migrations at `db/migration/`

## Project Structure

```
.
├── onlineshopui/           # Angular frontend
│   └── src/
│       ├── app/
│       │   ├── core/       # Singleton services, guards, interceptors
│       │   │   ├── config/
│       │   │   ├── mocks/
│       │   │   ├── providers/
│       │   │   ├── services/
│       │   │   └── types/
│       │   ├── features/   # Feature modules
│       │   │   ├── auth/
│       │   │   ├── cart/
│       │   │   ├── orders/
│       │   │   └── products/
│       │   └── clib/       # Shared component library
│       │       ├── components/
│       │       ├── layouts/
│       │       └── services/
│       └── environments/
├── onlineshopapi/          # Spring Boot backend
│   └── src/main/
│       ├── java/msg/onlineshopapi/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   │   └── mapper/
│       │   ├── exception/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       │       └── strategy/
│       └── resources/
│           ├── application.yml
│           └── db/migration/
└── docker/
    └── development/
        └── docker-compose.yml
```

## Backend Architecture

### Layer Responsibilities

**Controller Layer** (`controller/`)
- REST endpoint definitions
- Request validation
- Response mapping

**Service Layer** (`service/`)
- Business logic
- Transaction boundaries
- Strategy pattern for order fulfillment

**Repository Layer** (`repository/`)
- Data access with Spring Data JPA
- Query methods

**Model Layer** (`model/`)
- JPA entities
- Composite keys for junction tables

### Domain Model

```
User ────────┐
             │
             ▼
          Order ───────┐
             ▲         │
             │         ▼
             │    OrderDetail
             │         │
             │         ▼
             └─── Product ──── ProductCategory
                       │
                       ▼
                     Stock ──── Location
```

**Core Entities:**
- `User`: Customer accounts with role-based access
- `Product`: Catalog items with pricing, category, images
- `ProductCategory`: Product classification
- `Order`: Purchase records with delivery address
- `OrderDetail`: Line items linking orders to products
- `Stock`: Inventory levels per product per location
- `Location`: Warehouse/store locations

**Composite Keys:**
- `OrderDetailId`: (orderId, productId)
- `StockId`: (productId, locationId)

### Security

JWT-based authentication with:
- `JwtAuthenticationFilter`: Token validation on each request
- `JwtService`: Token generation and parsing
- `AuthController`: Login/register endpoints
- Role-based authorization (USER, ADMIN)

Configuration in `application.yml`:
- JWT secret via `${JWT_SECRET}`
- Token expiration: 24 hours (86400000ms)
- CORS origins via `${CORS_ALLOWED_ORIGINS}`

### Database Migrations

Flyway manages schema versions at `src/main/resources/db/migration/`:
- `V1__create_tables.sql`: Initial schema
- `V1.1__populate_mock_data.sql`: Test data (local profile)

### API Endpoints

Base path: `/api`

**Auth** (`/auth`)
- `POST /register`: Create account
- `POST /login`: Authenticate

**Products** (`/products`)
- `GET /`: List all products
- `GET /{id}`: Product details
- `POST /`: Create product (admin)
- `PUT /{id}`: Update product (admin)
- `DELETE /{id}`: Delete product (admin)

**Product Categories** (`/product-categories`)
- `GET /`: List all categories
- `GET /{id}`: Category details
- `POST /`: Create category (admin)
- `PUT /{id}`: Update category (admin)
- `DELETE /{id}`: Delete category (admin)

**Orders** (`/orders`)
- `GET /`: List user's orders
- `POST /`: Place order

OpenAPI documentation available at `/api/swagger-ui.html`

### Order Fulfillment Strategy

Strategy pattern at `service/strategy/` supports multiple fulfillment modes:
- `SINGLE_LOCATION`: Ship all items from one warehouse
- Extensible for multi-location, proximity-based routing

Configured via `app.order.strategy` in `application.yml`

## Frontend Architecture

### Module Organization

**Core Module** (`app/core/`)
Singleton services and shared infrastructure:
- `config/`: Environment configuration
- `mocks/`: API mocks for development
- `providers/`: Angular providers (HTTP interceptors, guards)
- `services/`: App-wide services (notifications)
- `types/`: TypeScript interfaces and types

**Feature Modules** (`app/features/`)
Lazy-loaded feature areas:
- `auth/`: Login, registration
- `cart/`: Shopping cart state and UI
- `orders/`: Order history and details
- `products/`: Product catalog and details

**Component Library** (`app/clib/`)
Reusable UI components:
- `components/`: Card, Modal, Navbar, Icon, Spinner, ErrorMessage, NotificationPopup
- `layouts/`: Page layout templates
- `services/`: Component-level services

### State Management

- Cart state in `cart/` feature with local storage persistence
- Auth state in `auth/` feature with JWT in session storage
- RxJS subjects for reactive updates

### HTTP Layer

- Base URL configuration in `environments/`
- Mock configuration with `start:mock` script
- HTTP interceptors in `core/providers/` for JWT injection

### Styling

TailwindCSS 4 utility-first approach:
- Configuration in project root
- Custom component styles in component directories
- Responsive design patterns

## Development Environment

### Prerequisites

- Node.js 24
- Java 21
- Docker (for PostgreSQL)
- Maven

### Environment Variables

**Backend** (`onlineshopapi/`)
```bash
DB_HOST=localhost
DB_PORT=5433
DB_NAME=shopdb
DB_USERNAME=shopuser
DB_PASSWORD=shoppassword
JWT_SECRET=your-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

**Database**
Docker Compose at `docker/development/docker-compose.yml`:
```bash
docker compose -f docker/development/docker-compose.yml up -d
```

### Running the Application

**Start Database:**
```bash
docker compose -f docker/development/docker-compose.yml up -d
```

**Start Backend:**
```bash
cd onlineshopapi
mvn spring-boot:run
```
API available at `http://localhost:3000/api`

**Start Frontend:**
```bash
cd onlineshopui
npm install
npm start
```
UI available at `http://localhost:4200`

**Mock Mode:**
```bash
npm run start:mock
```
Runs frontend without backend dependency.

### Testing

**Backend:**
```bash
cd onlineshopapi
mvn test
```
Uses Testcontainers for integration tests.

**Frontend:**
```bash
cd onlineshopui
npm test
```
Vitest with jsdom for component testing.

## API Contract

REST API with JSON payloads. Example flows:

**Authentication:**
```
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
→ Returns JWT token
```

**Place Order:**
```
POST /api/orders
Authorization: Bearer <token>
{
  "items": [
    {"productId": "uuid", "quantity": 2}
  ],
  "address": {
    "country": "USA",
    "city": "New York",
    "county": "Manhattan",
    "streetAddress": "123 Main St"
  }
}
```

## Deployment Considerations

**Database:**
- Production requires external PostgreSQL instance
- Update `DB_HOST`, `DB_PORT` environment variables
- Run Flyway migrations on deployment

**Backend:**
- Package: `mvn clean package`
- Produces executable JAR at `target/onlineshopapi-0.0.1-SNAPSHOT.jar`
- Set production JWT secret (minimum 256 bits)
- Configure CORS for production domain

**Frontend:**
- Build: `npm run build`
- Produces static assets in `dist/`
- Update `environment.prod.ts` with production API URL
- Serve via nginx or CDN

## Security Notes

- JWT secrets must be environment-specific, never committed
- HTTPS required in production for token security
- Password hashing via Spring Security's BCrypt
- Role-based access control enforces admin-only mutations
- CORS configured to whitelist frontend origin only

## Extension Points

**Add Payment Processing:**
- Create `PaymentService` in `service/`
- Add payment gateway integration
- Store transaction records in new `payments` table

**Multi-warehouse Fulfillment:**
- Implement new strategy in `service/strategy/`
- Add proximity calculation logic
- Update `app.order.strategy` configuration

**Product Reviews:**
- Add `Review` entity with user and product foreign keys
- Create `ReviewController` and `ReviewService`
- Add review endpoints to product details

**Admin Dashboard:**
- Create `admin/` feature module in frontend
- Add admin routes with role guard
- Build inventory and order management UI
