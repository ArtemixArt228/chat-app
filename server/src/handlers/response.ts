import { Response } from 'express'; // Import Express Response type

class ResponseHandler {
    // Common response constructor method
    static responseConstructor(res: Response, statusCode: number, data: any): Response {
        return res.status(statusCode).json(data);
    }

    // Bad request (400)
    static badRequest(res: Response, message: string): Response {
        return this.responseConstructor(res, 400, {
            message,
            status: 400,
        });
    }

    // Resource created (201)
    static created(res: Response, data: any): Response {
        return this.responseConstructor(res, 201, data);
    }

    // Internal server error (500)
    static error(res: Response): Response {
        return this.responseConstructor(res, 500, {
            message: "Server error",
            status: 500,
        });
    }

    // Success (200)
    static ok(res: Response, data: any): Response {
        return this.responseConstructor(res, 200, data);
    }

    // Not found (404)
    static notFound(res: Response, message: string): Response {
        return this.responseConstructor(res, 404, {
            message,
            status: 404,
        });
    }

    // Unauthorized access (401)
    static unauthorized(res: Response): Response {
        return this.responseConstructor(res, 401, {
            message: "No access. Authorization is required.",
            status: 401,
        });
    }
}

export default ResponseHandler;
