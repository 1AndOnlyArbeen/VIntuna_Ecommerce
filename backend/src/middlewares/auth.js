import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.model.js";


const verifyJWT = asyncHandler (async(req,res,next)=>{

   const token = req.cookies?.accessToken ||
   req.header("Authorization")?.replace("Bearer ","")

   if (!token) {
    throw new apiError(401, "unauthoried Request ")
    
   }

//    decoding the token 

   const decodedToken = jsonwebtoken.verify(token,process.env.GENERATE_ACCESSTOKEN_KEY)
   const user = await User.findById(decodedToken?.id).select(
    "-password -refreshToken" 
   )
   if(!user){

    throw new apiError(401, "invalid access token ")
   }

   req.user = user
   next()



})


export {  verifyJWT };