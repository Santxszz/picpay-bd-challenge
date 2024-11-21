import { Schema } from "mongoose";

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	document: { type: Number, required: true },
	account_category: { type: String, required: true },
	password: { type: String, required: true },
	wallet_id: { type: String},
});

export default userSchema;
