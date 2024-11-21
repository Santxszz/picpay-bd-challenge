import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";

interface IRequest {
	document: number;
	password: string;
}

export default class AuthUserService {
	public async execute({ document, password }: IRequest) {

		const regexNumber = /[^0-9]/
		if(regexNumber.test(`${document}`)) {
			throw new AppError("Document is invalid!")
		}

		const formatedDocument = Number(document);

		const userSchema = mongoose.model("userProfile", userProfile);
		const userExists = await userSchema.findOne({ document: formatedDocument });
		if (!userExists) {
			throw new AppError("User or password, is incorrect.");
		}

		const decodedPassword = await bcrypt.compare(password, userExists.password)

		if (!decodedPassword) {
			throw new AppError("User or password, is incorrect.");
		}

		const tokenPayload = {
			userId: userExists.id,
			userName: userExists.name.split(" ")[0],
		};

		const acessToken = jwt.sign(
			tokenPayload,
			process.env.SECRET_JWT as string,
			{ expiresIn: "12h" },
		);

		return { token: acessToken };
	}
}
