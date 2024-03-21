import { Schema, Document, model, models } from "mongoose";

// Document ek interface hai coming from Mongoose
// it repersent a single document instance
// by extending we are inherting all the properties & methods defined in the Document interface
export interface IImage extends Document {
	title: string;
	transformationType: string;
	publicId: string;
	secureURL: string;
	width?: number;
	height?: number;
	config?: object;
	transformationURL?: string;
	aspectRatio?: string;
	color?: string;
	prompt?: string;
	author: {
		_id: string;
		firstName: string;
		lastName: string;
	};
	createdAt?: Date;
	updatedAt?: Date;
}

// kya kya hona chaiye
// url , trnaformed image , width,height

const imageSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	transformationType: {
		type: String,
		required: true,
	},
	publicId: {
		type: String,
		required: true,
	},
	secureURL: {
		type: String,
		required: true,
	},
	width: {
		type: Number,
	},
	height: {
		type: Number,
	},
	config: {
		type: Object,
	},
	transformationURL: {
		type: String,
	},
	aspectRatio: {
		type: String,
	},
	color: {
		type: String,
	},
	prompt: {
		type: String,
	},
	// you can use Mongoose's populate() method to automatically replace the ObjectId with the actual "User" document data when retrieving the "Order" document.
	author: {
		// ye ek special data type hai mongoose ka jo ki mongoose ki batata hai ki ye field objectID store keregi of a document(Single useer) from another collection[User(model)]
		type: Schema.Types.ObjectId,
		// ye batta hai ki wo document is from User Collection.
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});
const Image = models.Image || model("Image", imageSchema);

export default Image;
