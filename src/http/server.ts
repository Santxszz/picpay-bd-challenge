import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
import "express-async-errors";
import "./database/index";

import authRoutes from "./routes/users.routes";
import { errors } from "celebrate";
import AppError from "./middlewares/AppError";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use(errors());
app.use(
	(error: Error, request: Request, response: Response, next: NextFunction) => {
		if (error instanceof AppError) {
			return response.status(error.statusCode).json({
				code: error.statusCode,
				status: error.statusMessage,
				message: error.message,
			});
		}

		return response.status(500).json({
			code: 500,
			status: "Internal Server Error",
			message: "Ocorreu um erro inesperado",
		});
	},
);

app.listen(port, () => {
	console.log("[Http Server]: Application running.");
});
