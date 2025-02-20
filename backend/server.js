import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express ();
const PORT = process.env.PORT || 3000;

console.log(PORT);

app.use(express.json());
app.use(cors());
app.use(helmet()); //security middleware
app.use(morgan("dev")); //log request

app.get("/api/products", (req, res) => {
    console.log(res.getHeaders());
    res.send("hello ian lami kayo ka");
})

app.listen(PORT, () => {
    console.log("Server is running " + PORT);
})