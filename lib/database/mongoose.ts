// Nextjs uses serverless functions means wo kisi server pe run nhi karte orr unki state presist nhi karti
// inko cloud provider hi manager karta hai
// to har baar naya connection banana padta hai , har ek function call anonymous hota hai [sabse alag]
// to har baar call na ho uske liye hum caching ka use karte hai ki ek baar karke store karle baar baar na karna pade

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// Next js has a feature called global object which is available throughout the application
// We can use this to store the connection and use it throughout the application
// This will prevent the creation of multiple connections
// This is a singleton pattern
// We are using the global object to store the connection and the promise

// Mongoose ek type defination hai or construtor hai ek MONGODB Instance[single execution of MONGODB ] ka

// conn hai ek mongoDB Instance - jo awwait karne k baad ata hai
// promise hai bina await kiya hua code - mongoose.connect(.....)
interface MongooseConnection {
	conn: Mongoose | null;
	promise: Promise<Mongoose> | null;
}

// initially iski value undefined hogi for the 1st call
// cached undefined chala jayega
let cached: MongooseConnection = (global as any).mongoose;

// undefined hai to hum global object mai mongoose ki value set kar denge
if (!cached) {
	cached = (global as any).mongoose = {
		conn: null,
		promise: null,
	};
}

export async function connectToDB() {
	// agar phle se connection hai to wo conn return kardo
	if (cached.conn) return cached.conn;

	if (!MONGODB_URL) {
		throw new Error("MongoDB URL is not defined");
	}

	cached.promise =
		cached.promise ||
		mongoose.connect(MONGODB_URL, {
			dbName: "imaginify",
			bufferCommands: false,
		});

	cached.conn = await cached.promise;
	return cached.conn;
}
