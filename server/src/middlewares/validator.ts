import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import responseHandlers from '../handlers/response';

const validator = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Send the response and exit the function
        responseHandlers.badRequest(res, errors.array()[0].msg);
        return; // Ensure no further code is executed after response
    }

    // Call next middleware if there are no errors
    next();
};

export default validator;
