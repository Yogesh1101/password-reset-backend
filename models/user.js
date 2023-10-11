import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export { User, generateToken };
