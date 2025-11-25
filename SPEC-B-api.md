# API Endpoint Descriptions

## Authentication
- **POST /auth/token**  
    Exchange credentials for an access token using OAuth2.

## Cart
- **POST /carts**  
    Create a new cart.  
    **Request:** `{ userId? }`  
    **Response:** `201 { cartId }`

- **GET /carts/{cartId}**  
    Retrieve the cart details.  
    **Response:** `200 { cart }`

- **POST /carts/{cartId}/items**  
    Add an item to the cart.  
    **Request:** `{ productId, qty, sku, metadata }`  
    **Response:** `201 { item }`

- **PATCH /carts/{cartId}/items/{itemId}**  
    Update the quantity of an item in the cart.  
    **Request:** `{ qty }`  
    **Response:** `200`

- **DELETE /carts/{cartId}/items/{itemId}**  
    Remove an item from the cart.  
    **Response:** `204`

- **POST /carts/{cartId}/apply-promo**  
    Apply a promotional code to the cart.  
    **Request:** `{ code }`  
    **Response:** `200`

- **POST /carts/{cartId}/calculate**  
    Calculate the totals for the cart.  
    **Response:** `200 { totals }`

## Checkout / Orders
- **POST /orders**  
    Create a new order from the cart.  
    **Request:** `{ cartId, paymentMethodId, idempotencyKey }`  
    **Response:** `201 { orderId, status }`

- **GET /orders/{orderId}**  
    Retrieve order details.  
    **Response:** `200 { order }`

## Catalog / Pricing (read-heavy)
- **GET /catalog/products**  
    Retrieve a list of products.

- **GET /pricing/quote**  
    Get a pricing quote based on the cart snapshot.  
    **Request:** `{ cartSnapshot }`  
    **Response:** `200 { linePrices, taxes, total }`

## Inventory / Reservations (internal)
- **POST /reservations**  
    Create reservations for items.  
    **Request:** `{ items[], ttl }`  
    **Response:** `200 { reservationIds }`

- **DELETE /reservations/{id}**  
    Delete a reservation.

## Sample Request/Response (Add Item)
**Request:**
```json
{
        "productId": "plan-123",
        "qty": 1,
        "sku": "PLAN-XL"
}
```

**Response:**
```json
{
        "itemId": "ci-456",
        "productId": "plan-123",
        "qty": 1,
        "unitPrice": 29.99,
        "metadata": {}
}
```  