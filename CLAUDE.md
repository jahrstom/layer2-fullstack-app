# Online Shop - Full-Stack E-Commerce Application

Three-tier architecture: Angular 21 frontend, Spring Boot 4 backend, PostgreSQL 18 database.

## Quick Start

1. Start database:
   ```bash
   docker compose -f docker/development/docker-compose.yml up -d
   ```

2. Start backend (from onlineshopapi/):
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```
   API: http://localhost:3000/api
   Swagger: http://localhost:3000/api/swagger-ui/index.html

3. Start frontend (from onlineshopui/):
   ```bash
   npm install
   npm start
   ```
   UI: http://localhost:4200

**Mock mode** (frontend only, no backend):
```bash
cd onlineshopui && npm run start:mock
```

## Architecture

**Stack:**
- Frontend: Angular 21 (onlineshopui/) - Port 4200
- Backend: Spring Boot 4 (onlineshopapi/) - Port 3000, context /api
- Database: PostgreSQL 18 (Docker) - Port 5433

**Backend layers:** Controller → Service → Repository → Model
**Frontend modules:** core/ (singletons), features/ (auth, cart, orders, products), clib/ (reusable UI)

See `docs/ARCHITECTURE.md` for complete architecture documentation.

## Testing

Backend (Testcontainers):
```bash
cd onlineshopapi && mvn test
```

Frontend (Vitest):
```bash
cd onlineshopui && npm test
```

## Environment Variables

Backend requires (auto-configured in `local` profile):
- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
- JWT_SECRET (token signing)
- CORS_ALLOWED_ORIGINS (default: http://localhost:4200)

**Local credentials:** shopdb @ localhost:5433, user: shopuser/shoppassword

## Code Organization

**Backend** (onlineshopapi/src/main/java/msg/onlineshopapi/):
- `model/` - JPA entities
- `repository/` - Data access
- `service/` - Business logic (uses strategy pattern for order fulfillment)
- `dto/` + `dto/mapper/` - API contracts
- `controller/` - REST endpoints

**Frontend** (onlineshopui/src/app/):
- `features/` - Lazy-loaded feature modules
- `clib/` - Reusable UI components
- `core/` - Singletons (services, guards, interceptors)

Use `/architecture-expert` skill for implementation guidance.

## Gotchas

- PostgreSQL on port 5433 (not 5432) to avoid conflicts
- Backend context path is /api (all endpoints: /api/*)
- JWT expires after 24h (86400000ms)
- Mock users (local): admin@onlineshop.com / password (ADMIN)
- Flyway: V1__create_tables.sql (schema), V1.1__populate_mock_data.sql (test data)
- Composite keys: OrderDetailId (orderId, productId), StockId (productId, locationId)

## Documentation

- `docs/ARCHITECTURE.md` - Complete architecture documentation (system overview, tech stack, layer responsibilities, domain model, API endpoints, deployment)
- `onlineshopapi/CLAUDE.md` - Backend-specific context (Spring Boot, JPA, Flyway, security)
- `onlineshopui/CLAUDE.md` - Frontend-specific context (Angular, components, state management)

## Skills Available

- `/architecture-expert` - Answers architecture questions, reviews code for consistency, guides feature implementation. Always consult before making architectural decisions.
- `/onboard-app` - Automated demo of the full user flow (registration → login → cart → order)
- `/technical-writer` - Create or improve technical documentation following editorial best practices
- `/claude-md-improver` - Audit and improve CLAUDE.md files for optimal project context
