import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';
import {asyncHandler} from "../utils/asyncHandler.js"    
import { ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async(userId) => {
    try{
       const user =  await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken 
       await user.save({validateBeforeSave: false})

       return {accessToken, refreshToken}

    }catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}
// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

     if([name, email, password].some((field) => field?.trim() === "")){
    throw new ApiError(400, "All fields are required")
  }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
          throw new ApiError(409, "User already exists!!")
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"    
)

if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}


return res.status(201).json(
    new ApiResponse(200, createdUser, "User registerered Successfully")
)
  } catch (error) {
    console.error('Registration error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message ||'Registration failed',
    });
  }
};

// Login user
const login = asyncHandler(async (req, res) =>{
  
  const {email, password} = req.body
  
  
  if(!email){
      throw new ApiError(400, "Email is required")
  }

  const user = await User.findOne({ email })
  
  if(!user){
      throw new ApiError(404, "User doesnot exist !!")
  }
  
  const isPasswordValid = await user.isPasswordCorrect(password)     
  
  if(!isPasswordValid){
      throw new ApiError(401, "Invalid User Credentials")
  }
  
  
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id) 
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken") 
  
  const options = {
      httpOnly: true,  // so that the cookie is not accessible from the client side javascript
      secure: true //// only send the cookie over https
  }
  
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200,
          {
              user: loggedInUser, accessToken,refreshToken 
          },
          "User loggedIn Successfully!"
      )
  )
  })

// Get current user
 const getMe = asyncHandler(async (req, res) => {
    const User = req.user;

    if(!User){
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized Request"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {user: User}, "User data fetched successfully"));

  });

  const logout = asyncHandler(async (req, res) => {
   
  await User.findByIdAndUpdate(
     req.user._id,                 
     {
         $set: {
             refreshToken: undefined  // set refreshToken to undefined in the database to delete the session
 
         }
     },
     {
         new: true   // return the updated user
     }
    )
 
    const options = {
     httpOnly: true,   // cookies options
     secure: true
    }
 
    return res
    .status(200)
    .clearCookie("accessToken", options)       
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))  
 });

 const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken // taking refresh token from cookies or body just in case it is not present in cookies

  if(!incomingRefreshToken){
      throw new ApiError(401, "Unauthorized Request")  
  }

try {
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET) 
  
  const user =await User.findById(decodedToken?._id) 
  
  if(!user){
      throw new ApiError(401, "Invalid Refresh Token")
  }
  
  if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh Token is expired or Used") 
  }
  
  const { accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id) 

  const options = {
      httpOnly: true,
      secure: true
  }
  
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
      new ApiResponse(
  
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access Token Refreshed"
      )
  )
  
  
} catch (error) {
  throw new ApiError(401, error?.message || "Invalid Refresh Token")
}


})

export {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
}