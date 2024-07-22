import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/clodinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async(req:Request,res:Response,next:NextFunction)=>{
    //console.log('files',req.files)

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
    }catch(err){
        console.log(err)
        return next(createHttpError(500, 'Error while uploading the files') )
    }
   
    res.json({message:"ok"})
}
export {createBook};