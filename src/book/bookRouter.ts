import  express  from "express";
import path from 'node:path';
import multer from "multer";
import { createBook, deleteBook, getSingleBook, listBook, updateBook } from "./bookController";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router()


// file storing locally by multer --> it stores the data files locally until it is externally stored , once reachd then deletes it.
const upload = multer({
    dest : path.resolve(__dirname,'../../public/data/uploads'), //if not existed now it will create automatically
    limits:{fileSize:3e7}                                       // 3e7---> 30 mb
})

//routes for Adding
bookRouter.post('/',
    authenticate,
    upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
]),createBook ) ;
//routes for Updating 
bookRouter.patch('/:bookId',
    authenticate,
    upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
]),updateBook ) ;

bookRouter.get('/',listBook)
bookRouter.get('/:bookId',getSingleBook)
bookRouter.delete('/:bookId',authenticate,deleteBook)


export default bookRouter;