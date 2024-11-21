import { Schema } from "mongoose";

const walletUserSchema = new Schema({
	balance: { type: Number, required: true, default: 0 },
	keys_transfer: { type: Array },
	user_id: { type: String, required: true },
});

export default walletUserSchema;
