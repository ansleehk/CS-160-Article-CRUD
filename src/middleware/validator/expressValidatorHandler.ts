import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { RestResponse } from '../../type/restReponse.js';

export const handleExpressValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    const response: RestResponse = {
        success: false,
        errors: errors.array().map(err => err.msg),
        data: {}
    }

    return res.status(400).json(response);
  }

  next();
}
