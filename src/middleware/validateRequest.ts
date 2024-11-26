import type { Schema } from 'joi';
import type { NextFunction, Request, Response } from 'express';

export const validateRequest =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    error ? res.status(400).send({ error: error.details[0].message }) : next();
  };
