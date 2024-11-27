import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";
import walletUserSchema from "../../database/schemas/users/Wallet";

interface IRequest {
	userId: string;
}

export default class ShowUserService {
	public async execute({ userId }: IRequest) {
		const userSchema = mongoose.model("userProfile", userProfile);
		const walletSchema = mongoose.model("userWallet", walletUserSchema);

		const userInfo = await userSchema.findById(userId);
		const walletUserInfo = await walletSchema.findOne({ user_id: userId });

		const objectResponse = {
			name: userInfo.name,
			email: userInfo.email,
			account_category: userInfo.account_category,
			walletId: walletUserInfo.id,
			keysTransfer: walletUserInfo.keys_transfer
				? walletUserInfo.keys_transfer
				: "Chave Não Cadastrada",
			balance: walletUserInfo.balance,
		};

		return objectResponse;
	}
}
