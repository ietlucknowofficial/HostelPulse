import express from "express";
import authRoutes from "./routes/auth.routes.mjs"
import studentRoutes from "./routes/student.routes.mjs"
import {connectDB} from "./config/db.mjs"
import dotenv from "dotenv"
import cors from 'cors'
dotenv.config();
const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}))

app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/student',studentRoutes)


const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log(`Server running on port 3000`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};
startServer();

