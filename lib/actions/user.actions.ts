// server actions are always asynchronomous functions
"user server";

import { Handshake } from "lucide-react";
import User from "../database/models/user.model";
import { connectToDB } from "../database/mongoose";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";

// Create
export async function createUser(data: CreateUserParams) {
	try {
		await connectToDB();
		const newUser = await User.create(data);
		//using this technique we removing any mongoose specific methods or reference value which we don't need.
		// for example - The __v property is added by Mongoose to track the version of the document for optimistic concurrency control.
		// jab num isko JSON string mai convert karte hai tab ye sab data lost ho jata hai
		// orr baad mai hum isko JSON mai parse kar lete hai

		// JSON.stringfy - {"name":"JAYANT","age":"12"}
		// JSON.parse - {name:"JAyant",age:"12"}
		// inme convert kar dega
		return JSON.parse(JSON.stringify(newUser));
	} catch (error) {
		handleError(error);
	}
}

//READ
export async function getUserById(id: string) {
	try {
		await connectToDB();

		const user = await User.findOne({ clerkId: id });
		if (!user) {
			throw new Error("User don't exist");
		}

		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		handleError(error);
	}
}

//UPDATE
export async function updateUser(clerkId: string, data: UpdateUserParams) {
	try {
		await connectToDB();
		// BY default findOneAndUpdate wo update se phle wale document ko return karta hai
		// agar new:true set ho to ye updated user deta hai
		const updatedUser = await User.findOneAndUpdate({ clerkId }, data, {
			new: true,
		});
		if (!updatedUser) throw new Error("User update failed");

		return JSON.parse(JSON.stringify(updateUser));
	} catch (error) {
		handleError(error);
	}
}

// DELETE
export async function deleteUser(clerkId: string) {
	try {
		const userToDelete = await User.findOne({ clerkId });
		if (!userToDelete) throw new Error("User doesn't exist");

		const deletedUser = await User.findByIdAndDelete(userToDelete._id);

		revalidatePath("/");

		return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
	} catch (error) {
		handleError(error);
	}
}

// USE Credit
export async function useCredit(userId: string, creditFee: number) {
	try {
		await connectToDB();
		const updatedUserCredits = await User.findOneAndUpdate(
			{ _id: userId },
			{ $inc: { creditBalance: creditFee } },
			{ new: true }
		);

		if (!updatedUserCredits) throw new Error("User Credit Update Failed");

		return JSON.parse(JSON.stringify(updatedUserCredits));
	} catch (error) {
		handleError(error);
	}
}
