import express, { NextFunction, Request, Response } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHanlder from './middlewares/globalErrorHandlers';
const app = express();

app.get('/',(req,res,next)=>{
    res.json({message:'Welcome to ebook apis'})
    // const error = createHttpError(400,"Something went wrong") 
    // here error was created to test whether the global req handler was working or not 
    // throw error;
})

//global error handler
app.use(globalErrorHanlder);

export default app;