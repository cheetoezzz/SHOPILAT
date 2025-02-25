import express, { request } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); //security middleware
app.use(morgan("dev")); //log request

// arcjet rate limiting to all routes

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({error: "Limit exceeded"});
      } else if (decision.reason.isBot()) {
        res.status(403).json({error: "Bot detected"});
      } else {
        res.status(403).json({error: "Forbidden"});
      }
      return 
    }

    //check for spoofed bots
    if (decision.result.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({error: "Spoofed bot detected"});
      return;
    }

    next()
  } catch (error) {
    console.log("Arcjet error", error);
    next(error)
  }
});

app.use("/api/products", productRoutes);

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            image VARCHAR(200) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("Database is connected");
  } catch (error) {
    console.log("Error initDB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running at port " + PORT);
  });
});
