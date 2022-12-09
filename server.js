import express from "express";
import cors from "cors";
import "express-async-errors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connect.js";

// handler middlewares
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authHandler from "./middleware/auth.js";

// routes modules
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
// app.use(bodyParser.json({limit: "30mb", extends: true}));
// app.use(bodyParser.urlencoded({limit: "30mb", extends: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage
const storage = multer.diskStorage({
    destination: function (res, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });


// API routes
app.use("/api/v1/auth", upload.single("picture"), authRouter);
app.use("/api/v1/users", authHandler, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const server = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => console.log(`Server run on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

server();
