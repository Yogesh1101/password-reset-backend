import express from "express";
import bcrypt from "bcrypt";
import { getUserByEmail, getUserById } from "../controllers/user.js";
import { User, generateToken } from "../models/user.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// login routes
router.post("/login", async (req, res) => {
  try {
    // check user exist or not
    const user = await getUserByEmail(req);
    if (!user) {
      return res.status(404).json({ error: "User does not exists." });
    }
    // validate the password
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(404).json({ error: "Invalid Credentials." });
    }
    const token = generateToken(user._id);
    res.status(200).json({ message: "Logged in Successfully.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// signup routes
router.post("/signup", async (req, res) => {
  try {
    // check user already exist
    let user = await getUserByEmail(req);
    if (user) {
      return res.status(400).json({ error: "User Already Exists" });
    }

    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    }).save();
    const token = generateToken(user._id);
    res.status(201).json({ message: "Successfully Created.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await getUserByEmail(req);
    if (!user) {
      return res.status(404).json({ error: "User does not exists." });
    }
    const secret = process.env.SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    });
    
    const link = `https://password-reset-ay3q.onrender.com/user/reset-password/${user._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kumarjryogesh@gmail.com",
        pass: "kwwchizkgymjwptm",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: user.email,
      subject: "Password Reset Link",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
    res.status(200).json({ message: "Logged in Successfully.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.get("/user/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ error: "User does not exists." });
  }
  const secret = process.env.SECRET_KEY + user.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    res.send("Not Verified");
    console.log(error);
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ error: "User does not exists." });
  }
  const secret = process.env.SECRET_KEY + user.password;
  try {
    const verify = jwt.verify(token, secret);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.updateOne({ _id: id }, { $set: { password: hashedPassword } });
    // res.json({ status: "Password Updated" });
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    res.json({ status: "Something went wrong" });
    console.log(error);
  }
});

export const userRouter = router;
