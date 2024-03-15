import { connectToDB } from "@/lib/database/mongoose";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
	connectToDB();
	return (
		<main className="">
			{/* <p>Home</p>
			<UserButton afterSignOutUrl="/" /> */}
		</main>
	);
}
