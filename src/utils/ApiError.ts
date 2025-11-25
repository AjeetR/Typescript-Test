// errors/ApiError.ts
export class ApiError extends Error {
    public statusCode: number;
    public details?: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(msg: string, details?: any) {
        return new ApiError(400, msg, details);
    }

    static unauthorized(msg: string = "Unauthorized") {
        return new ApiError(401, msg);
    }

    static notFound(msg: string = "Not Found") {
        return new ApiError(404, msg);
    }

    static internal(msg: string = "Internal Server Error") {
        return new ApiError(500, msg);
    }
}
