# Online Shop API - Spring Boot Backend

Spring Boot 4 REST API with JWT authentication, JPA/Hibernate, and Flyway migrations.

## Quick Start

Run with local profile (uses preconfigured dev DB credentials):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**Or use IntelliJ run configuration:** `api:local` from `.run/` folder

API: http://localhost:3000/api
Swagger UI: http://localhost:3000/api/swagger-ui/index.html

## Testing

Integration tests use Testcontainers (requires Docker):
```bash
mvn test
```

## Architecture

**Layered architecture:**
```
Controller (HTTP) → Service (business logic) → Repository (data access) → Model (JPA entities)
```

**Package structure** (src/main/java/msg/onlineshopapi/):
- `controller/` - REST endpoints (`@RestController`, request validation)
- `service/` - Business logic (`@Service`, `@Transactional`)
  - `service/strategy/` - Order fulfillment strategies (configured via `app.order.strategy`)
- `repository/` - Spring Data JPA interfaces
- `model/` - JPA entities with relationships
- `dto/` - API request/response objects
  - `dto/mapper/` - Entity ↔ DTO converters
- `security/` - JWT filter, JWT service, security config
- `exception/` - Custom exceptions and handlers
- `config/` - Application configuration

**Controllers:**
- `AuthController` - POST /register, /login
- `ProductController` - CRUD /products
- `ProductCategoryController` - CRUD /product-categories
- `OrderController` - GET /orders, POST /orders

## Domain Model

**Entities:**
- `User` - Customer accounts with role (USER, ADMIN)
- `Product` - Catalog items (price, category, stock)
- `ProductCategory` - Product classification
- `Order` - Purchase records with delivery address
- `OrderDetail` - Line items (composite key: orderId + productId)
- `Stock` - Inventory per location (composite key: productId + locationId)
- `Location` - Warehouse locations

**Relationships:**
```
User ──→ Order ──→ OrderDetail ──→ Product ──→ ProductCategory
                                      ↓
                                    Stock ──→ Location
```

## Database

**Flyway migrations** (src/main/resources/db/migration/):
- `V1__create_tables.sql` - Schema
- `local/V1.1__populate_mock_data.sql` - Test data (local profile only)

**Mock users (local profile):**
- admin@onlineshop.com / password (ADMIN)
- john.doe@email.com / password (CUSTOMER)
- jane.smith@email.com / password (CUSTOMER)

**PostgreSQL connection:**
- Host: localhost:5433 (not 5432!)
- Database: shopdb
- Credentials: shopuser / shoppassword (local profile)

## Security

**JWT authentication:**
- Login via `AuthController` returns JWT token
- `JwtAuthenticationFilter` validates token on each request
- Token expiration: 24 hours (86400000ms)
- Secret configured via `${JWT_SECRET}` env var

**Role-based access:**
- Use `@PreAuthorize("hasRole('ADMIN')")` for admin-only endpoints
- Product/category mutations require ADMIN role
- Orders scoped to authenticated user

## Configuration

**application.yml** - Base config with env var placeholders
**application-local.yml** - Local dev profile with hardcoded credentials

**Key properties:**
- `server.port=3000`
- `server.servlet.context-path=/api`
- `app.order.strategy=SINGLE_LOCATION` (strategy pattern config)
- `app.cors.allowed-origins` - CORS whitelist

## Common Patterns

**Composite keys:**
- Create `@Embeddable` ID class (e.g., `OrderDetailId`)
- Use `@EmbeddedId` in entity
- Override equals/hashCode in ID class

**Strategy pattern:**
- See `service/strategy/` for order fulfillment
- Configured via `app.order.strategy` property
- Extend for multi-location fulfillment

**DTO pattern:**
- Never expose entities directly in REST responses
- Create DTOs in `dto/` package
- Write mappers in `dto/mapper/`

## Gotchas

- Context path is `/api` - all endpoints require this prefix
- PostgreSQL on port 5433 to avoid conflicts with default 5432
- Flyway runs on startup - schema changes require new migration files
- Local profile auto-populates test data (V1.1 migration)
- Testcontainers tests start ephemeral PostgreSQL - requires Docker
- JWT secret must be 256+ bits for HS256 algorithm
