import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/clodinary";
import path from "node:path";
import  fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    //console.log('files',req.files)
    const {title,genre} = req.body;

    try{
    //Upload Images Starts
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    const filename = files.coverImage[0].filename;
    const filepath = path.resolve(__dirname,'../../public/data/uploads',filename)
    const bookImageUploadResult = await cloudinary.uploader.upload(filepath,{
        filename_override:filename,
        folder:'book-covers',
        format:coverImageMimeType,
    })
    //console.log('bookImageuploadresult',bookImageUploadResult)
    //Upload Images Ends

    //Upload Files Starts
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname,"../../public/data/uploads",bookFileName);
    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
         resource_type:'raw',
         filename_override:bookFileName,
         folder:'book-pdfs',
         format:"pdf",
    })
    //console.log('bookfileuploadresult',bookFileUploadResult)
    //Uplaod Files Ends


    //@ts-ignore
    console.log("UserId",req.userId);

    // creating a new book
    const _req = req as AuthRequest
    const newBook = await bookModel.create({
        title,
        genre,
        author:_req.userId,
        coverImage:bookImageUploadResult.secure_url,
        file:bookFileUploadResult.secure_url,
    })

    //deleting temporary files stored in the local storage
    await fs.promises.unlink(filepath)
    await fs.promises.unlink(bookFilePath)
    

    res.status(201).json({id : newBook._id})

    }catch(err){
        console.log(err)
        return next(createHttpError(500, 'Error while uploading the files') )
    }
}
   
export {createBook}; 