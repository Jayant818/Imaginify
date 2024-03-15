import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignIN = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center bg-purple-100">
			<SignIn />
		</div>
	);
};

export default SignIN;
