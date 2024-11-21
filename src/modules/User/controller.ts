import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { User } from "../../entities/User.js";
import { AppDataSource } from "../../config/database.js";
import jwt from "jsonwebtoken";
import { configs } from "../../config/env.js";
import { throws } from "assert";

const userRepository = AppDataSource.getRepository(User);

const register = async (req: Request, res:Response) => {
    const {name, email, password} = req.body;
    try{
        const userExists = await userRepository.findOneBy({email});
        if(userExists) {
            res.status(409).send({message: "Email is already taken"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({name, email, password: hashedPassword});
        await userRepository.save(user);
        res.status(201).send({message: "User Registered Succefully"})
    } catch(error) {
        res.status(500).send({message: "Error in Creating the User", error})
    }
}

const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const userExists = await userRepository.findOneBy({email});

        if(!userExists ||  !(await bcrypt.compare(password, userExists.password))) {
            res.status(401).send({message: "Login Credintials are wrong"});
            return;
        }
        if(!configs.auth.JWT_SECRET) {
            throw new Error('Error in generating token');
        }
        const token = jwt.sign({userId: userExists.id},configs.auth.JWT_SECRET);
        res.status(200).send({message:"Login Succefull", token})
    } catch (error){
        res.status(500).send({message: "Error in Login the User", error})
    }
}

const profile = (req: Request, res: Response) => {
    res.send('User Profile controller');

}

export default {register, login, profile}