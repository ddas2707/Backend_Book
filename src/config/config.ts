import { config as conf } from "dotenv";
conf();

const _config ={
    port : process.env.PORT || 3000,
    databaseUrl : process.env.MONGODB_URL,
    env : process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET
}
export const config = Object.freeze(_config) // freeze as such it is read-only