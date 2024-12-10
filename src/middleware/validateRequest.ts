import type { Schema } from 'joi';
import type { NextFunction, Request, Response } from 'express';

export const validateRequest =
  (schema: { body?: Schema; query?: Schema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query);

      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }

      // As`joi` does not mutate original object with default values
      // we needed those defaults to be used in controller
      req.query = value;
    }
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
    }
    next();
  };
