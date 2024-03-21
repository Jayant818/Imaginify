import React from "react";
import Headers from "@/components/shared/Headers";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";

const page = async ({ params: { type } }: SearchParamProps) => {
	// gives the user id;
	const { userId } = auth();

	const transformation = transformationTypes[type];
	if (!userId) redirect("/sign-in");
	const user = await getUserById(userId);
	return (
		<div className="w-full flex justify-center ">
			<div className="w-[75%]">
				<Headers
					title={transformation.title}
					subtitle={transformation.subTitle}
				/>
				<section className="mt-10">
					<TransformationForm
						userId={user._id}
						creditBalance={user.creditBalance}
						action="Add"
						type={transformation.type as TransformationTypeKey}
					/>
				</section>
			</div>
		</div>
	);
};

export default page;
