import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import userModel from "./userModel";

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

    //Password --->hashed password
    const hashedPassword = await bcrypt.hash(password,10) //since hash method returns a promise we need to wrap up in async-await

    //Response
    res.json({message:"User Created"})
}

export default createUser;