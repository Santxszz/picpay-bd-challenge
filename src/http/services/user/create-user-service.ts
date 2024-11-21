import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";
import walletUserSchema from "../../database/schemas/users/Wallet";

interface IRequest {
	name: string;
	email: string;
	document: string;
	account_category?: string;
	password: string;
}

export default class CreateLoginService {
	public async execute({
		name,
		email,
		document,
		account_category,
		password,
	}: IRequest) {
		const regexNumber = /[^0-9]/;
		if (regexNumber.test(`${document}`)) {
			throw new AppError("Document is invalid!");
		}

		const userSchema = mongoose.model("userProfile", userProfile);
		const walletSchema = mongoose.model("userWallet", walletUserSchema)

		const userEmailExists = await userSchema.findOne({ email });
		const userDocumentExists = await userSchema.findOne({ document });
		if (userDocumentExists || userEmailExists) {
			throw new AppError("User already exists!", 400);
		}

		const hashedPassword = await bcrypt.hash(password, 8);

		switch (document.length) {
			case 11:
				account_category = "Conta Pessoal";
				break;
			case 14:
				account_category = "Conta Empresarial";
				break;
			default:
				throw new AppError("CPF/CNPJ is invalid!");
		}

		const userCreated = await userSchema.create({
			name,
			email,
			document: Number(document),
			account_category,
			password: hashedPassword,
		});

		const walletCreated = await walletSchema.create({
			balance: 0,
			user_id: userCreated.id
		})
		
		await userCreated.updateOne({
			wallet_id: walletCreated.id
		})

		const userObject = {
			name,
			email,
			document,
			account_category,
		};

		return userObject;
	}
}
