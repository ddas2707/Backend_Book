import express, { NextFunction, Request, Response } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHanlder from './middlewares/globalErrorHandlers';
import userRouter from './user/userRouter';
const app = express();
app.use(express.json())

app.get('/',(req,res,next)=>{
    res.json({message:'Welcome to ebook apis'})
    const error = createHttpError(400,"Something went wrong") 
    // here error was created to test whether the global req handler was working or not 
    throw error;
})

app.use('/api/users',userRouter)

//global error handler
app.use(globalErrorHanlder);


export default app; 