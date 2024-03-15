import { Model, Schema, models } from "mongoose";

const userSchema = new Schema({
	clerkId: {
		type: String,
		requied: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		uinque: true,
	},
	Photo: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	tokens: {
		type: Number,
		default: 10,
	},
	planId: {
		type: Number,
		default: 1,
	},
});

// models - An array containing all models associated with this Mongoose instance.
const User = models.User || new Model("User", userSchema);

export default User;
