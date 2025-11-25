import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

class Authonticate {
    private static readonly SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

    auth(req: Request, res: Response, next: NextFunction): void {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                const err = new Error('No authorization header');
                (err as any).code = 'NO_AUTH_HEADER';
                throw err;
            }

            const parts = authHeader.split(' ');
            const token = parts.length === 2 ? parts[1] : undefined;
            if (!token || token !== 'abc123xyz') {
                const err = new Error('Invalid token');
                (err as any).code = 'INVALID_TOKEN';
                throw err;
            }

            // Use synchronous verify so thrown jwt errors are caught by the outer try/

            // Verify JWT 
            // this will throw an error if the token is invalid or expired
            // need to implement the signing part when creating tokens
            //only verifying here is to see if the token is "abc123xyz"
            // const decoded = jwt.verify(token, Authonticate.SECRET_KEY);
            // (req as Request & { user?: unknown }).user = decoded; // Attach decoded user info to request object

            next();
        } catch (error) {
            const code = error && typeof error === 'object' && 'code' in error ? (error as any).code : 'TOKEN_VERIFICATION_FAILED';
            res.status(401).json({ message: 'Unauthorized', code });
        }
    }
}

export default new Authonticate;