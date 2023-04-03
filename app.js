import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import databaseConfig from "./src/config/db.js";
import studentRoutes from "./src/routes/studentRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

//CORS MIDDLEWARE
app.use(cors(corsOptions));

app.use("/students", databaseConfig, studentRoutes);
// Define a route for the homepage
app.get("/", (req, res) => {
  res.send("Welcome to my Express app!");
});

export default app;
