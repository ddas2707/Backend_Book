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

const updateBook = async(req:Request,res:Response,next:NextFunction)=>{
    const {title,genre} = req.body;
    const bookId = req.params.bookId; 
    const book =  await bookModel.findOne({_id:bookId});
    if(!book){
        return next(createHttpError(401,"Book Not Found"));
    }
    //checking if the user has access to the book
    const _req = req as AuthRequest;
    if(book.author.toString() != _req.userId){
        return next(createHttpError(403,"You cannot update others Book. "))            //403--> u are a loggedin user but donot have the access to these books
    }

    //check if the image field exists or not
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
        const filename = files.coverImage[0].filename;
        const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        // send files to cloudinary
        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + filename
        );
        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: converMimeType,
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
    }
     // check if file field exists or not.
     let completeFileName = "";
     if (files.file) {
         const bookFilePath = path.resolve(
             __dirname,
             "../../public/data/uploads/" + files.file[0].filename
         );
 
         const bookFileName = files.file[0].filename;
         completeFileName = bookFileName;
 
         const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
             resource_type: "raw",
             filename_override: completeFileName,
             folder: "book-pdfs",
             format: "pdf",
         });
 
         completeFileName = uploadResultPdf.secure_url;
         await fs.promises.unlink(bookFilePath);
     }
     //if any changes have been done that it is used here 
     const updatedBook = await bookModel.findOneAndUpdate(
        {
            _id:bookId
        },
        {
            title:title,
            genre:genre,
            coverImage : completeCoverImage ? completeCoverImage:book.coverImage,
            file : completeFileName?completeFileName:book.file,
        },
        {new:true}
     );
     res.json(updatedBook);
}
   
export {createBook,updateBook}; 