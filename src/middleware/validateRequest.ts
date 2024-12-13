import type { Schema } from 'joi';
import type { NextFunction, Request, Response } from 'express';

export const validateRequest =
  (schema: { body?: Schema; query?: Schema; params?: Schema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
    }

    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        res.status(400).send({ error: error.details[0].message });
        return;
      }
    }

    next();
  };
