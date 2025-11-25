class CartsService {
    private carts: any[];

    constructor(initialCarts: any[] = []) {
        this.carts = initialCarts; // Initialize carts with provided data
    }

    // Create a new cart
    createCart(cart: any) {
        this.carts.push(cart);
        return cart;
    }

    // Read a cart by ID
    getCart(cartId: string) {
        return this.carts.find(cart => cart.cartId === cartId);
    }

    // Update a cart by ID
    updateCart(cartId: string, updatedCart: any) {
        const index = this.carts.findIndex(cart => cart.cartId === cartId);
        if (index !== -1) {
            this.carts[index] = { ...this.carts[index], ...updatedCart };
            return this.carts[index];
        }
        return null;
    }

    // Delete a cart by ID
    deleteCart(cartId: string) {
        const index = this.carts.findIndex(cart => cart.cartId === cartId);
        if (index !== -1) {
            return this.carts.splice(index, 1)[0];
        }
        return null;
    }
}

export default CartsService;