import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.middleware.js';
import { registerUser, verifyEmailController, loginController, logoutController, uploadAvatarController, updateUSerDetailController,forgetPasswordController, verifyForgetPasswordOtpController, resetPasswordController,refreshAccessTokenController, loginUserDetailsController} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.post('/logout',verifyJWT, logoutController)
userRouter.post('/upload-avatar', verifyJWT,upload.single ('avatar'), uploadAvatarController)
userRouter.put('/update-user', verifyJWT, updateUSerDetailController)
userRouter.post('/forget-password', forgetPasswordController)
userRouter.post('/verify-forget-password-otp', verifyForgetPasswordOtpController)
userRouter.post('/reset-password', resetPasswordController)
userRouter.post('/refresh-token', refreshAccessTokenController)
userRouter.get('/login-user-details', verifyJWT, loginUserDetailsController)


export { userRouter };
