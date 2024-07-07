import express, { NextFunction, Request, Response } from 'express'
const app = express();
import createHttpError, { HttpError } from 'http-errors';
import { config } from '../config/config';


//global error handler
const globalErrorHanlder = (err:HttpError,req:Request,res:Response,next:NextFunction )=>{
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message:err.message,
        errorStack: config.env === 'development' ? err.stack : '', 
    })
}
export default globalErrorHanlder;