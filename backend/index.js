dotenv.config();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import errorMiddleware from "./middlewares/errorMiddleware.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode
        };
      }
    }
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(errorMiddleware)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
