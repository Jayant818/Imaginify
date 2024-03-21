"use server";

import { revalidatePath } from "next/cache";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { connectToDB } from "../database/mongoose";
import { handleError } from "../utils";
import { redirect } from "next/navigation";
// npm i cloudinary
import { v2 as cloudinary } from "cloudinary";

// Add image to DB
// jo bhi define kiya hai wo sab in the image schema
export async function addImage({ image, userId, path }: AddImageParams) {
	try {
		await connectToDB();

		const author = await User.findById(userId);
		if (!author) throw new Error("user not found");

		const newImage = await Image.create({
			...image,
			author: author._id,
		});

		revalidatePath(path);

		return JSON.parse(JSON.stringify(newImage));
	} catch (error) {
		handleError(error);
	}
}

// Update
export async function updateImage({ image, userId, path }: UpdateImageParams) {
	try {
		await connectToDB();

		const imageToUpdate = await Image.findById(image._id);

		if (!imageToUpdate || imageToUpdate.toHexString() !== userId)
			throw new Error("Image not found");

		const updatedImage = await Image.findByIdAndUpdate(
			imageToUpdate._id,
			image,
			{ new: true }
		);

		revalidatePath(path);

		return JSON.parse(JSON.stringify(updatedImage));
	} catch (error) {
		handleError(error);
	}
}

// Delete - imageId
export async function deleteImage(imageId: string) {
	try {
		await connectToDB();

		await Image.findByIdAndDelete(imageId);
	} catch (error) {
		handleError(error);
	} finally {
		redirect("/");
	}
}

// Get Image -  image Id , usse related user bhi populate karna hai
export async function getImage(imageId: string) {
	try {
		await connectToDB();

		const image = await Image.findById(imageId).populate({
			path: "author",
			model: "User",
			select: "_id firstName lastName clerkId",
		});

		if (!image) throw new Error("Image not found");

		return JSON.parse(JSON.stringify(image));
	} catch (error) {
		handleError(error);
	}
}

export async function getAllImages({
	limit = 9,
	page = 1,
	searchQuery = "",
}: {
	limit?: number;
	page: number;
	searchQuery?: string;
}) {
	try {
		await connectToDB();

		// get data from cloudinary based on search query if any?
		// get the ids of them and get all the images from our DB based on Id.
		// only get the required part based on the page number.
		cloudinary.config({
			cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			// for establishing secure connection
			secure: true,
		});

		let expression = "folder=imaginify";

		if (searchQuery) {
			expression += "AND ${searchQuery}";
		}

		const { resources } = await cloudinary.search
			.expression(expression)
			.execute();

		// get all resource ids
		const resourceIds = resources.map((resource: any) => resource.public_id);

		let query = {};

		if (searchQuery) {
			query = {
				publicId: {
					$in: resourceIds,
				},
			};
		}

		// agar page  = 1 to skip amount 0 hoga
		const skipAmount = (Number(page) - 1) * limit;

		const data = await Image.find(query)
			.populate({
				path: "author",
				model: "User",
				select: "_id firstName lastName clerkId",
			})
			.sort({ updatedAt: -1 })
			.skip(skipAmount)
			.limit(limit);

		// All images jo search param se match  khati hai
		const totalImages = await Image.find(query).countDocuments();
		const savedImages = await Image.find().countDocuments();

		return {
			data: JSON.parse(JSON.stringify(data)),
			totalPage: Math.ceil(totalImages / limit),
			savedImages,
		};
	} catch (e) {
		handleError(e);
	}
}

// GET IMAGES BY USER
export async function getUserImages({
	limit = 9,
	page = 1,
	userId,
}: {
	limit?: number;
	page: number;
	userId: string;
}) {
	try {
		await connectToDB();

		const skipAmount = (Number(page) - 1) * limit;

		const images = await Image.find({ author: userId })
			.populate({
				path: "author",
				model: "User",
				select: "_id firstName lastName clerkId",
			})
			.sort({ updatedAt: -1 })
			.skip(skipAmount)
			.limit(limit);

		const totalImages = await Image.find({ author: userId }).countDocuments();

		return {
			data: JSON.parse(JSON.stringify(images)),
			totalPages: Math.ceil(totalImages / limit),
		};
	} catch (error) {
		handleError(error);
	}
}
