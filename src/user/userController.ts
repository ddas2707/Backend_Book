import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import userModel from "./userModel";
import {sign} from "jsonwebtoken" 
import { config } from "../config/config";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password} = req.body;
    //validation process 
    if(!name || !email || !password){
        const error = createHttpError(400,"All fields are required")
        return next(error);
        //return res.json({message:'All fields are req'}) <---- old methods
    }
    //Databse Call
    const user = await userModel.findOne({email})
    if(user){
        const error = createHttpError(400,"User Alreay Existed with this email")
        return next(error)
    }

    //Password ---> hashed password
    const hashedPassword = await bcrypt.hash(password,10) //since hash method returns a promise we need to wrap up in async-await
    // 10 is the salt rounds more --> more security but slows down cpu
    const newUser = await userModel.create({
        name,
        email,
        password:hashedPassword,
    })

    //token generation jwt
    const token = sign({sub:newUser._id},config.jwtSecret as string,{expiresIn:'7d'})    //sub property should be user id
    // if u want to add any specific algorithm for encryption then write inside {} after 7d',......


    //Response
    res.json({accesstoken:token});
}

export default createUser;