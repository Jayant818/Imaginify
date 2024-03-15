import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUP = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center bg-purple-100">
			<SignUp />
		</div>
	);
};

export default SignUP;
