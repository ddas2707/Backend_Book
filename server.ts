
import app from './src/app'
import { config } from './src/config/config'
import connectionDB from './src/config/db'

const startServer = async()=>{
    await connectionDB();

    const port = config.port || 3000
    app.listen(port,()=>{
        console.log(`Listening on port: ${port}`)
    })
}

startServer();