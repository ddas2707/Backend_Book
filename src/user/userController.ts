import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import userModel from "./userModel";
import {sign} from "jsonwebtoken" 
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password} = req.body;
    //validation process 
    if(!name || !email || !password){
        const error = createHttpError(400,"All fields are required")
        return next(error);
        //return res.json({message:'All fields are req'}) <---- old methods
    }
    //Databse Call
    try{
        const user = await userModel.findOne({email})
        if(user){
        const error = createHttpError(400,"User Alreay Existed with this email")
        return next(error)
        }
    }catch(err){
        return next(createHttpError(500,"Error while getting user"))
    }
    

    //Password ---> hashed password
    const hashedPassword = await bcrypt.hash(password,10) //since hash method returns a promise we need to wrap up in async-await
    // 10 is the salt rounds more --> more security but slows down cpu
    let newUser : User;
    try{
        newUser = await userModel.create({
            name,
            email,
            password:hashedPassword,
        })
    }catch(err){
        return next(createHttpError(500,'Error while creating user'))
    }


    //token generation jwt
    try{
     const token = sign({sub:newUser._id},config.jwtSecret as string,{expiresIn:'7d',algorithm:'HS256'}) 
    //sub property should be user id
    // if u want to add any specific algorithm for encryption then write inside {} after 7d',......
    //   {expiresIn:'7d',algorithm:"HS256"}
    //Response
    res.status(201).json({accesstoken:token});
    }
    catch(err){
        return next(createHttpError(500,'Error while signing the jwt token'))
    }

}

const loginUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password} = req.body;
    //validation-->fields are empty or not  
    if(!email || !password){
        return next(createHttpError(400,'All fields are required'))
    }
   
    try{
        //validation-->user exists or not
        const user = await userModel.findOne({email});
        if(!user){
            return next(createHttpError(400,'User not Found !!!'))
        }
        //To check whether the hashed password matches the hashed database password 
        const isMatch = await bcrypt.compare(password,user.password) // will return a boolean
        //incase it didn't match
        if(!isMatch){
            return next(createHttpError(400,'Username or Password incorrect !!! '))
        }  
        //incase it match
        const token = sign({sub:user._id},config.jwtSecret as string,{expiresIn:'7d',algorithm:'HS256'}) 
        res.status(201).json({accessToken:token})  

    }catch(err){
        return next(createHttpError(500,'Error while getting the user'))
    }
}
export {createUser,loginUser};