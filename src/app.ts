import express from 'express'
const app = express();

app.get('/',(req,res,next)=>{
    res.json({message:'Welcome to ebook apis'})
})

export default app;