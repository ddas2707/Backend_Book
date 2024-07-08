import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password} = req.body;
    //validation process 
    if(!name || !email || !password){
        const error = createHttpError(400,"All fields are required")
        return next(error);
        //return res.json({message:'All fields are req'}) <---- old methods
    }
    res.json({message:"User Created"})
}

export default createUser;