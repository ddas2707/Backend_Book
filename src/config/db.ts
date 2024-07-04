import mongoose from "mongoose";
import { config } from "./config";

const connectionDB = async()=>{
    try{
        mongoose.connection.on('connected',()=>{
            console.log('Finally Connected Sucessfully')
        })
        mongoose.connection.on('error',(err)=>{
            console.log("Error in connecting database",err)
        })
        mongoose.connect(config.databaseUrl as string)
    }catch(err){
        console.error("Failed to Connect with the database",err)
        process.exit(1)
    }
}
export default connectionDB;