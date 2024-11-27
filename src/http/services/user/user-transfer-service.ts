import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userProfile from "../../database/schemas/users/Users";
import walletUserSchema from "../../database/schemas/users/Wallet";
import AppError from "../../middlewares/AppError";

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

		if (ammount > userWalletInfo.balance) {
			throw new AppError("You don't have balance in the bank.", 400);
		}

		if (userInfo.account_category !== "Conta Pessoal") {
			throw new AppError("Your account don't make transfers.", 400);
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

		await walletSchema.findOneAndUpdate(
			{ user_id: userId },
			{
				$set: {
					balance: walletUserInfo.balance - ammount,
				},
			},
		);

		const userReceiverWallet = await walletSchema.findOne({
			keys_transfer: keyTransfer,
		});
		const userReceiverInfo = await userSchema.findOne({
			_id: userReceiverWallet.user_id,
		});

		const dataReceiver = {
			name: userReceiverInfo.name,
			transferKey: keyTransfer,
		};

		const dataPayment = {
			value: ammount,
		};

		const objectResponse = {
			"Receiver details": dataReceiver,
			"Payment details": dataPayment,
		};

		return objectResponse;
	}
}
