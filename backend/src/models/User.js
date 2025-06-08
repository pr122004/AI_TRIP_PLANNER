import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
     refreshToken: {
    type: String
},
    avatar: {
      type: String,
      default: '',
    },
    trips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
      },
    ],
    preferences: {
      interests: [String],
      travelStyle: {
        type: String,
        enum: ['budget', 'moderate', 'luxury'],
        default: 'moderate',
      },
      preferredAccommodation: String,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {   

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);

  next(); // next() to make sure the next middleware is called or the request is sent to the next handler
});

userSchema.methods.isPasswordCorrect = async function (password) {   
  return await bcrypt.compare(password, this.password)  
}


userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          name: this.name,
          
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      { 
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const User = mongoose.model('User', userSchema);