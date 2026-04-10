import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { sendEmail } from '../config/sendEmail.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../utils/generateAccessAndRefreshToken.js';

import { generateOtp, otpExpireTime } from '../utils/generateOtp.js';
import { forgetPasswordTemplate } from '../utils/forgetPasswordTemplate.js'
import jsonwebtoken from 'jsonwebtoken';






const registerUser = asyncHandler(async (req, res) => {
    /* step to register the user :
      1. first get the data from the frontend 
      2. check if the user already exists
      3. check if the user is valid
      4. hash the password
      5. save the user to the database
      6. return the user
      */

    // get user details from frontend

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new apiError(400, 'All fields are required');
    }
    // email validation regex

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new apiError(400, 'email should be in correct format ');
    }
    if (password.length < 8) {
        throw new apiError(400, 'Password must be at least 8 characters');
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
        throw new apiError(400, 'User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(password, salt);

    const payload = {
        name,
        email,
        password: hasPassword,
    };

    const newUser = new User(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
    const verifyEmail = await sendEmail({
        sendTo: email,
        subject: 'Welcome to VintunaStore',
        html: verifyEmailTemplate({
            name: name,
            url: verifyEmailUrl,
        }),
    });
    const userResponse = await User.findById(save._id).select('-password -refreshToken');
    return res.status(201).json(new apiResponse(201, userResponse, 'User registered successfully'));
});

const verifyEmailController = asyncHandler(async (req, res) => {
    // step :

    // 1. get the code from the frontend
    // 2. find the user with the code
    // 3. if user not found throw error
    // 4. if user found update the isVerified field to true
    // 5. return the user

    const { code } = req.body;

    const user = await User.findOne({ _id: code });
    if (!user) {
        throw new apiError(400, 'invalid Code ');
    }

    const updateUser = await User.updateOne(
        { _id: code },
        {
            verify_email: true,
        },
    );

    return res.status(200).json(new apiResponse(200, 'Email has been verified '));
});

const loginController = asyncHandler(async (req, res) => {
    /*  step to login controller:
    1. get the userEmail and Password from the frontend
    2, check if the user exists or not 
    3. if not exit throw error
    4. if exist check if the password is correct or not
    5. if password is incorrect throw error
      
    */

    const { email, password } = req.body;

    // checking wether the all fields are entered or not

    if (!email || !password) {
        throw new apiError(400, 'all field are required  ');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(400, 'User with this email address didint exit');
    }

    if (user.status !== 'Active') {
        throw new apiError(
            400,
            'your accoutt is either inactive or suspended contact the Admin for help ',
        );
    }

    const checkpassword = await bcrypt.compare(password, user.password);

    if (!checkpassword) {
        throw new apiError(400, 'your password didnt matched ');
    }

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const option = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };

    //returning the response
    return res
        .status(200)
        .cookie('accessToken', accessToken, option)
        .cookie('refreshToken', refreshToken, option)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User Logged In successFully ',
            ),
        );
});

const logoutController = asyncHandler(async (req, res) => {
    /* 
    step:
    1. get the user id from the access token
    2. find the user with the id
    3. if user not found throw error
    4. if user found update the refresh token to null
    5. return the response
     */
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },

        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };
    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new apiResponse(200, {}, 'user Logged out successfully '));
});



const uploadAvatarController = asyncHandler(async (req, res) => {

    /*upload user avatar image
  step: 
  1. get the user id from the auth middleware
  2. get the image from the multer middleware
  3. check if the image is present or not if not throw error
  4. if image is present upload the image to cloudinary
  */
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
        throw new apiError(400, 'image is required');
    }

    const result = await uploadOnCloudinary(file.path,);

    const response = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: result.secure_url,
            },
        },
        {
            new: true,
        },
    );

    return res
        .status(200)
        .json(new apiResponse(200, response, 'avatar uploaded successfully '));
});



const updateUSerDetailController = asyncHandler(async (req, res) => {

    /*
  update user details and password hased 
  
  step :
  1. get the user id from the auth middleware
  2. get the user details from the frontend
  3. check if the user details are present or not if not throw error, check if there is password then has it 
  4. if user details are present update the user details in the database
  5. return the response
  */

    const userId = req.user._id // auth middleware
    const { name, email, mobile, password } = req.body
    console.log(mobile)

    if (!name || !email || !mobile || !password) {
        throw new apiError(400, "all fields are required")
    }

    let hasPassword = ""

    if (password) {

        const salt = await bcrypt.genSalt(10)
        hasPassword = await bcrypt.hash(password, salt)

    }

    const updateUser = await User.updateOne({ _id: userId }, {
        ...(name && { name: name }),
        ... (email && { email: email }),
        ... (mobile && { mobileNumber: mobile }),
        ...(password && { password: hasPassword })
    })

    return res
        .status(200)
        .json(new apiResponse(200, updateUser, "User details Updated Succesfully "))

});


const forgetPasswordController = asyncHandler(async (req, res) => {
    /* Forget Password step : 
    1. get the email from the frontend
    2. check if the user with the given email exist in our database or not if not then throw error
    3. if user exist then generate a otp and save it to the database with the user details and set the otp expire time to 10 minutes
    4. send the otp to the user email address with the help of resend email service
    5. return the response  apiResponse with success message.
    */



    const { email } = req.body
    if (!email) {
        throw new apiError(400, "email is required ")

    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new apiError(400, "user with this email didnt exist kindly provide the correct email address")

    }

    const otp = generateOtp()
    const otpexpiry = otpExpireTime()



    const hashedOtp = await bcrypt.hash(String(otp), 10);
    user.forgot_password_otp = hashedOtp;

    // When verifying:
    const isValidOtp = await bcrypt.compare(String(otp), user.forgot_password_otp);
    if (!isValidOtp) {
        throw new apiError(400, "Invalid OTP");
    }
    user.forgot_password_expiry = otpexpiry;

    const savingOtp = await user.save()
    console.log(`your otp is being saved :`, savingOtp)

    const sendOtpEmail = await sendEmail({
        sendTo: email,
        subject: "Forget Password OTP",
        html: forgetPasswordTemplate({ name: user.name, otp })

    })

    return res
        .status(200)
        .json(new apiResponse(200, sendOtpEmail, "OTP sent to your email successfully"))
});

const verifyForgetPasswordOtpController = asyncHandler(async (req, res) => {


    /*
    
    verify forget password otp
    
    step : 
    1: get the email and otp from the frontend
    2. check if the user with the given email exist in our database or not if not then throw error
    3. if user exist then check if the otp is correct or not if not then throw error
    4. if otp is correct then check if the otp is expired or not if expired then throw error
    5. if otp is valid then return the response with success message and allow the user to reset the password
    6.
    */

    const { email, otp } = req.body


    if (!email || !otp) {
        throw new apiError(400, "email and otp is required ")
    }

    const user = await User.findOne({ email })

    if (!user) {

        throw new apiError(400, " User with this email didnt exist ")

    }

    const currentTime = new Date()

    if (!(await bcrypt.compare(String(otp), user.forgot_password_otp))) {
        throw new apiError(400, "Invalid OTP ")
    }

    if (user.forgot_password_expiry < currentTime) {
        throw new apiError(400, "OTP has expired kindly request for new OTP ")
    }

    const updateUser = await User.findByIdAndUpdate(user?._id, {
        forgot_password_otp: "",
        forgot_password_expiry: ""
    })

    return res
        .status(200)
        .json(new apiResponse(200, {}, "OTP is valid you can reset your password now "))

})



const resetPasswordController = asyncHandler(async (req, res) => {



    /* reset password step : 
    1. get the email, otp and new password from the frontend
    2. check if the user with the given email exist in our database or not if not then throw error
    3. if user exist then check if the otp is correct or not if not then throw error
    4. if otp is correct then check if the otp is expired or not if expired then throw error
    5. if otp is valid then hash the new password and update the password in the database
    6. return the response with success message.
    
    */

    const { email, newPassword, confirmPassword } = req.body

    if (!email || !newPassword || !confirmPassword) {
        throw new apiError(400, "all field are required ")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new apiError(400, " Email is not available  ")

    }

    if (newPassword !== confirmPassword) {
        throw new apiError(400, " new password and confirm password must match ")

    }
    if (newPassword.length < 8) {
        throw new apiError(400, 'Password must be at least 8 characters');
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(newPassword, salt)

    const update = await User.findByIdAndUpdate(user._id, {
        password: hashPassword
    })

    return res
        .status(200)
        .json(new apiResponse(200, "password has been updated SuccessFully"))

})


const refreshAccessTokenController = asyncHandler(async (req, res) => {


    /*refresh token step :
    
    1. get the refresh token from the cookie
    2. check if the refresh token is present or not if not then throw error
    3. if refresh token is present then verify the refresh token
    4. if refresh token is valid then generate new access token and refresh token
    5. update the refresh token in the database
    6. return the response with new access token and refresh token
    
    */
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jsonwebtoken.verify(
        incomingRefreshToken,
        process.env.GENERATE_REFRESHTOKEN_KEY
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    };


    const accessToken = await generateAccessToken(user._id);
    const newRefreshToken = await generateRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
        );
});


const loginUserDetailsController = asyncHandler(async (req, res) => {


    /* step to get loginUser Details
    1. get the user id from the auth middleware
    2. find the user with the id
    3. if user not found throw error
    4. if user found return the user details except password and refresh token
    
    */

    const userId = req.user._id

    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        throw new apiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new apiResponse(200, user, "Login user details fetched successfully "))




})
//get login user details

export { registerUser, verifyEmailController, loginController, logoutController, uploadAvatarController, updateUSerDetailController, forgetPasswordController, verifyForgetPasswordOtpController, resetPasswordController, refreshAccessTokenController, loginUserDetailsController }