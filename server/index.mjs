import express from "express";
import authRoutes from "./routes/auth.routes.mjs"
import {connectDB} from "./config/db.mjs"
import dotenv from "dotenv"
dotenv.config();
const app = express();



app.use(express.json());
app.use('/api/auth',authRoutes)


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

