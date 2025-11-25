import express, { Request, Response, NextFunction } from "express";
// import usersRouter from "./routes/users";
// import ordersRouter from "./routes/orders";
import cartRouter from "./routes/cartRouter.js";
import LoggerService from "./middlewares/LoggerService.js";
import Authonticate from "./middlewares/Authonticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// File: src/app.ts

const app = express();

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
    LoggerService.logInfo(`${req.method} ${req.url}`);
    next();
});
app.use(errorHandler);

// Public routes
// app.use("/users", usersRouter);

// Protected routes
// app.use("/orders", auth, ordersRouter);
app.use("/cart", Authonticate.auth, cartRouter);

// Healthcheck
// app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// Basic 404
app.use((_req: Request, res: Response) => res.status(404).json({ message: "Resource Not Found" }));

// Error handling middleware
app.listen(3000, () => {
    console.log("Server running on port 3000");
});