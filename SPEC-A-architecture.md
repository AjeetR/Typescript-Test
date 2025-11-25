# Telecom Shopping Cart API — Architecture Description

Purpose
- Define an API-driven architecture to support a telecom shopping cart: product (plans, devices, SIMs, add-ons) discovery, cart lifecycle, price/discount calculation, checkout, order creation, billing and provisioning.

Scope
- Customer-facing REST/HTTP API for web/mobile apps.
- Backend services for catalog, pricing, cart, orders, billing, provisioning, inventory.
- Integrations with OSS/BSS, payment gateway, CRM, KYC.

Design goals
- API-first, consistent REST (or JSON:API) with OpenAPI spec.
- Strong consistency where needed (orders, billing), eventual consistency for inventory reservations and provisioning.
- Scalable, resilient, observable, secure (PCI/DSS for payments).
- Extensible to new product types, promotions, and fulfillment flows.

Non-functional requirements
- High availability (99.95%+ for API tier).
- Sub-second p95 for cart operations.
- ACID for order writes; eventual consistency for downstream provisioning.
- Multi-region support for latency and disaster recovery.

High-level architecture
- API Gateway (TLS, auth, rate limiting, routing)
- Auth & Identity (OAuth2 / OIDC, JWTs)
- Frontend clients (web/mobile)
- Microservices:
    - Catalog Service (products, plans, attributes)
    - Pricing Service (price calc, taxes, promotions)
    - Cart Service (session or user carts, item validation)
    - Inventory & Reservations Service (SIMs, devices)
    - Order Service (final order, idempotent)
    - Billing Service (payments, invoicing)
    - Provisioning Service (OSS adapters)
    - Notification Service (email/SMS/webhooks)
- Data stores:
    - Relational DB (orders, customers, transactions)
    - NoSQL or document DB (catalog, shopping cart snapshots)
    - Redis (session, reservation locks, rate limits)
    - Message broker (Kafka/RabbitMQ) for events between services
- Integrations: Payment gateway (PCI), CRM, KYC provider, OSS/BSS adapters

Key principles
- Stateless API services; state in backing stores.
- Idempotent checkout (client-supplied idempotency-key).
- Event-driven for asynchronous processes (provisioning, notifications).
- Domain-driven design: bounded contexts for Catalog, Cart, Order, Billing, Provisioning.

Domain model (core types)
- Product { id, sku, type: [plan, device, sim, add-on], metadata }
- Price { productId, currency, amount, taxRules }
- Cart { id, userId | sessionId, items[], totals, promotions[], status }
- CartItem { id, productId, sku, qty, unitPrice, metadata }
- Order { id, cartId, userId, items, totals, paymentStatus, fulfillmentStatus }
- Reservation { id, itemId, reservedUntil, status }
- Event { type, payload, metadata }

Cart lifecycle
- Create cart (anonymous or user)
- Add/update/remove items (validate catalog, pricing, inventory)
- Apply promotions/coupons
- Calculate totals (prices + taxes + discounts + shipping)
- Reserve inventory / SIMs (soft hold)
- Checkout -> create order -> payment -> finalize -> trigger provisioning
- Release reservations on cancellation/timeout

APIs (examples)
- Authentication
    - POST /auth/token — exchange credentials -> access_token (OAuth2)
- Cart
    - POST /carts { userId? } -> 201 { cartId }
    - GET /carts/{cartId} -> 200 { cart }
    - POST /carts/{cartId}/items { productId, qty, sku, metadata } -> 201 { item }
    - PATCH /carts/{cartId}/items/{itemId} { qty } -> 200
    - DELETE /carts/{cartId}/items/{itemId} -> 204
    - POST /carts/{cartId}/apply-promo { code } -> 200
    - POST /carts/{cartId}/calculate -> 200 { totals }
- Checkout / Orders
    - POST /orders { cartId, paymentMethodId, idempotencyKey } -> 201 { orderId, status }
    - GET /orders/{orderId} -> 200 { order }
- Catalog / Pricing (read-heavy)
    - GET /catalog/products
    - GET /pricing/quote { cartSnapshot } -> 200 { linePrices, taxes, total }
- Inventory / Reservations (internal)
    - POST /reservations { items[], ttl } -> 200 { reservationIds }
    - DELETE /reservations/{id}

Sample request/response (add item)
Request
{
    "productId": "plan-123",
    "qty": 1,
    "sku": "PLAN-XL"
}
Response
{
    "itemId": "ci-456",
    "productId": "plan-123",
    "qty": 1,
    "unitPrice": 29.99,
    "metadata": {}
}

Checkout flow (sequence)
1. Client requests pricing/validation -> PricingService + CatalogService
2. CartService requests InventoryService to reserve items
3. Client initiates checkout with idempotency key
4. OrderService creates Order (DB transaction), emits OrderCreated event
5. BillingService charges payment (via gateway); on success, update paymentStatus
6. OrderService transitions to FulfillmentRequested and emits events
7. ProvisioningService consumes events, calls OSS adapters to provision SIMs/plans/devices
8. NotificationService informs customer; update order status

Data consistency and patterns
- Use transactional DB for Order creation (strong consistency).
- Use event sourcing / change events for asynchronous processing and audit trail.
- Use outbox pattern for reliable event publishing.
- Use optimistic locking or reservation TTLs to prevent oversell.

Security & Compliance
- TLS everywhere, HSTS.
- OAuth2/OIDC for authentication, scope-based authorization.
- JWT access tokens with short TTLs.
- RBAC for internal APIs.
- PCI-DSS: tokenize payment details, use hosted payment pages or PCI-compliant gateway.
- PII encryption at rest, KMS-managed keys.
- Input validation, rate limiting, WAF.

Reliability & Scalability
- Autoscale stateless services (Kubernetes).
- Read replicas for read-heavy catalog/pricing.
- Redis for hot carts and locks.
- Circuit breakers, bulkheads, retries with exponential backoff.
- Use exponential backoff + idempotency for external connector failures.

Observability
- Structured logs (correlationId per request).
- Distributed tracing (OpenTelemetry).
- Metrics (request rates, latencies, error rates) + dashboards.
- Alerts for key SLO breaches (order failures, provisioning errors).
- Auditing for order/payment actions.

Testing strategy
- Unit tests for services and pricing rules.
- Contract tests for external integrations (payment, OSS/BSS).
- Integration tests for cart -> order -> billing -> provisioning flows.
- End-to-end tests with staging environment and synthetic traffic.
- Chaos exercises for failure modes (message loss, slow downstreams).

Deployment & CI/CD
- Build artifacts (container images) and store in registry.
- Automated pipelines run unit, integration, and contract tests.
- Canary or blue/green deployment for services handling orders.
- Database migrations with backwards-compatible schema changes.

Operational considerations
- Customer support tools: order lookup by phone, email, transaction id.
- Reconciliation jobs between orders and billing.
- Refunds, cancellations, returns and business rules.
- Data retention and GDPR compliance (right to be forgotten).

Extensibility
- Plugin model for new product types, promotions and fulfillment adapters.
- Feature flags for progressive rollout.
- GraphQL edge or BFF for client-specific aggregation if needed.

Risks & mitigations
- Oversell -> enforce reservations, TTLs, inventory reconciliation.
- Payment failures -> support retry flows and manual capture.
- Provisioning inconsistency -> idempotent provisioning adapters and reconciliation.

Appendix — Minimal OpenAPI hints
- Define schemas for Cart, CartItem, Order, Price.
- All write endpoints accept idempotency-key header for safety on retries.
- Use 4xx/5xx standard error responses with machine-readable error codes.

This architecture focuses on the core needs of a telecom shopping cart: flexible product modeling (plans, devices, SIMs), accurate pricing and promotions, safe inventory/reservation handling, reliable order creation and provisioning, and secure, observable operation.