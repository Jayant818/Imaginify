import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	stripeId: {
		type: String,
		unique: true,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	plan: {
		type: String,
		required: true,
	},
	credits: {
		type: Number,
	},
	buyer: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Transaction =
	models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
