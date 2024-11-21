import bcrypt from "bcrypt";
import mongoose, { mongo } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import userProfile from "../../database/schemas/users/Users";
import AppError from "../../middlewares/AppError";
import walletUserSchema from "../../database/schemas/users/Wallet";

interface IRequest {
	keyTransfer: string;
	userId: string;
}

export default class CreateKeyTransferService {
	public async execute({ keyTransfer, userId }: IRequest) {
		const transferKey = `${keyTransfer}-${uuidv4()}`;

		const userSchema = mongoose.model("userProfile", userProfile);
		const walletSchema = mongoose.model("userWallet", walletUserSchema);
		const userUpdateKey = await walletSchema.findOneAndUpdate(
			{ user_id: userId },
			{
				$set: {
					keys_transfer: transferKey,
				},
			},
		);

		return userUpdateKey;
	}
}
