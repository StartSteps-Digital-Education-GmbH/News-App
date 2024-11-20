import { Schema } from "joi"
import {NextFunction, Request, Response} from "express";

export const validateRequest = (schema : Schema) => (req: Request, res: Response, next: NextFunction) => {
    const {error} = schema.validate(req.body);

    if(error) {
        return res.status(400).send({error: error.message})
    }

    next();
}