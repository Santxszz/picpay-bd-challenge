import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";
import walletUserSchema from "../../database/schemas/users/Wallet";

interface IRequest {
	userId: string;
	ammount: number;
}

export default class DepositBalanceService {
	public async execute({ userId, ammount }: IRequest) {
		const userSchema = mongoose.model("userProfile", userProfile);
		const walletSchema = mongoose.model("userWallet", walletUserSchema);

		if (ammount < 0) {
			throw new AppError("The ammount must be longer than 1!");
		}

		const currentBalance = await walletSchema.findOne({ user_id: userId });
		const currentAccount = await userSchema.findById(userId);

		await walletSchema.findOneAndUpdate(
			{ user_id: userId },
			{
				$set: {
					balance: currentBalance.balance + ammount,
				},
			},
		);

		const balanceUpdated = await walletSchema.findOne({ user_id: userId });

		const responseObject = {
			name: currentAccount.name,
			email: currentAccount.email,
			account_category: currentAccount.account_category,
			ammount: balanceUpdated.balance,
		};

		return responseObject;
	}
}
