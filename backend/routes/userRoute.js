import express from 'express';
import { loginUser,registerUser,forgotPassword,resetPassword,getUserDetails,updateUser,deleteUser} from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.put("/resetpassword/:token", resetPassword);
userRouter.get('/details', getUserDetails);
userRouter.delete('/delete', deleteUser);
userRouter.put('/update', updateUser);

export default userRouter;