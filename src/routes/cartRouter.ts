import { Router } from "express";
import CartsService  from "../controllers/CartsService.js";
import data from '../data.json' with { type: 'json' };

const cartRouter = Router();

// Initialize service (you can pass initial data if needed)
const cartsService = new CartsService(data.carts || [] );

/**
 * CREATE a new cart
 * POST /cart
 */
cartRouter.post("/", (req, res) => {
    const newCart = cartsService.createCart(req.body);
    res.status(201).json(newCart);
});

/**
 * READ a cart by ID
 * GET /cart/:id
 */
cartRouter.get("/:id", (req, res) => {
    const cartId = String(req.params.id);
    const cart = cartsService.getCart(cartId);

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
});

/**
 * UPDATE a cart
 * PUT /cart/:id
 */
cartRouter.put("/:id", (req, res) => {
    const cartId = String(req.params.id);
    const updated = cartsService.updateCart(cartId, req.body);

    if (!updated) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.json(updated);
});

/**
 * DELETE a cart
 * DELETE /cart/:id
 */
cartRouter.delete("/:id", (req, res) => {
    const cartId = String(req.params.id);
    const deleted = cartsService.deleteCart(cartId);

    if (!deleted) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.json({
        message: "Cart deleted",
        deleted
    });
});

export default cartRouter;