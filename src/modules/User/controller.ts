import { Request, Response } from "express";

const register = (req: Request, res:Response) => {
    res.send('User Register controller');
}

const login = (req: Request, res: Response) => {
    res.send('User Login controller');

}

const profile = (req: Request, res: Response) => {
    res.send('User Profile controller');

}

export default {register, login, profile}