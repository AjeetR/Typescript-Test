// Authentication Types
export interface AuthToken {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
}

export interface Authentication {
    token: AuthToken;
}

// User Types
export interface User {
    userId: string;
    name: string;
    email: string;
}

// Cart Types
export interface CartItem {
    itemId: string;
    productId: string;
    qty: number;
    unitPrice: number;
    metadata: Record<string, unknown>;
}

export interface Cart {
    cartId: string;
    userId: string;
    items: CartItem[];
}

// Product Types
export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    sku: string;
}

export interface Catalog {
    products: Product[];
}

// Order Types
export interface Order {
    orderId: string;
    status: "pending" | "completed" | "cancelled";
    cartId: string;
    paymentMethodId: string;
}

// Pricing Types
export interface LinePrice {
    productId: string;
    price: number;
    qty: number;
    total: number;
}

export interface Quote {
    linePrices: LinePrice[];
    taxes: number;
    total: number;
}

export interface Pricing {
    quote: Quote;
}

// Reservations Types
export interface Reservations {
    reservationIds: string[];
}
