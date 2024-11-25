import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";
import walletUserSchema from "../../database/schemas/users/Wallet";

interface IRequest {
	userId: string;
	keyTransfer: string;
	ammount: number;
}

export default class TransferService {
	public async execute({ userId, keyTransfer, ammount }: IRequest) {
		const userSchema = mongoose.model("userProfile", userProfile);
		const walletSchema = mongoose.model("userWallet", walletUserSchema);

		const userInfo = await userSchema.findById(userId);
		const userWalletInfo = await walletSchema.findOne({ user_id: userId });

		if (userInfo.account_category !== "Conta Pessoal") {
			throw new AppError("Your account don't make transfers.");
		}

		if (ammount > userWalletInfo.balance) {
			throw new AppError("You don't have balance in the bank.");
		}

		const walletUserInfo = await walletSchema.findOne({
			user_id: userId,
		});

		await walletSchema.findOneAndUpdate(
			{ keys_transfer: keyTransfer },
			{
				$inc: {
					balance: ammount,
				},
			},
		);

		const updateAmmountTransfer = await walletSchema.findOneAndUpdate(
			{ user_id: userId },
			{
				$set: {
					balance: walletUserInfo.balance - ammount,
				},
			},
		);

		const objectResponse = {
			valorTransferido: ammount,
			recebedor: keyTransfer,
		};

		return objectResponse;
	}
}
