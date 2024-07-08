import  express  from "express"
import createUser from "./userController";
const userRouter = express.Router()

//routes
userRouter.post('/register', createUser) //video mai {} dala h koi issue nhi h per....
export default userRouter;