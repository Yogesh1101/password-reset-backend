import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Here, the user schema is intialized
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});


const User = new mongoose.model("user", userSchema);

// Also generated a token for the each users
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export { User, generateToken };
