import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { getImage } from "@/lib/actions/image.actions";
import Headers from "@/components/shared/Headers";

const Page = async ({ params: { id } }: SearchParamProps) => {
	const { userId } = auth();

	if (!userId) redirect("/sign-in");

	const user = await getUserById(userId);
	const image = await getImage(id);

	const transformation =
		transformationTypes[image.transformationType as TransformationTypeKey];

	return (
		<div className="pl-20 flex flex-col">
			<Headers
				title={transformation.title}
				subtitle={transformation.subTitle}
			/>

			<section className="mt-10">
				<TransformationForm
					action="Update"
					userId={user._id}
					type={image.transformationType as TransformationTypeKey}
					creditBalance={user.creditBalance}
					config={image.config}
					data={image}
				/>
			</section>
		</div>
	);
};

export default Page;
