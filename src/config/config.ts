import { config as conf } from "dotenv";
conf();

const _config ={
    port : process.env.PORT || 3000,
    databaseUrl : process.env.MONGODB_URL,
    env : process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloud:process.env.CLOUDINARY_CLOUD,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinarySecret:process.env.CLOUDINARY_API_SECRET,
    frontendDomain:process.env.FRONTEND_DOMAIN,
}
export const config = Object.freeze(_config) // freeze as such it is read-only