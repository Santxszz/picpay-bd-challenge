import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectMongoDb() {
	await mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log("[Mongo DB]: Sucessfully connection.");
		})
		.catch((err) => {
			if (err) {
				console.log(err);
			}
		});
}

connectMongoDb();

export default connectMongoDb;
