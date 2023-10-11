import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataBaseConnection } from "./db.js";
import { userRouter } from "./routes/user.js";

// This is main file and runs first

// configure the environment variables
dotenv.config();

// express is assigned to app variable and port number
const app = express();
const PORT = process.env.PORT || 7000;

// middlewares
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// connecting to the database
dataBaseConnection();

// // sanity check server
// app.get("/", (req, res) => {
//   res.send({ data: "All Working Good" });
// });

// routes
app.use("/user", userRouter);

// server connection
app.listen(PORT, () => console.log(`Server started at localhost: ${PORT}`));
