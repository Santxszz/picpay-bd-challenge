import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import AppError from "./AppError";

interface JwtPayload {
	userId: string;
	userName: string;
}

export default async function checkUserAuth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const userToken = req.headers.authorization;
	const bearerToken = userToken?.split(" ")[1];
	const userId = req.body.userId || req.params.userId;

	await jwt.verify(
		bearerToken as string,
		process.env.SECRET_JWT as string,
		(err, userInfo) => {
			if (err) {
				throw new AppError("Token is Invalid", 400);
			}
			const tokenPayload = userInfo as JwtPayload;
			if (tokenPayload.userId !== userId) {
				throw new AppError("Not Authorized.", 401);
			}
		},
	);
	next();
}
