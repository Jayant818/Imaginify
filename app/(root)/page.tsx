import { Collection } from "@/components/shared/Collections";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import { connectToDB } from "@/lib/database/mongoose";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home({ searchParams }: SearchParamProps) {
	const page = Number(searchParams?.page) || 1;
	const searchQuery = (searchParams?.query as string) || "";

	const images = await getAllImages({ page, searchQuery });
	return (
		<main className="w-full  flex  flex-col gap-5 justify-center px-10  lg:px-20">
			<section className=" hidden w-full md:flex flex-col items-center gap-10 rounded-md  bg-[url('/assets/images/banner-bg.png')] bg-cover  bg-no-repeat p-10 shadow-inner">
				<h3 className="text-4xl w-full text-center font-semibold leading-tight tracking-wide text-white">
					Unleash Your Creative
					<br />
					Vision with Imaginify
				</h3>
				<ul className="flex gap-20">
					{navLinks.slice(1, 5).map((item) => (
						<li key={item.route} className="flex flex-col gap-4 items-center">
							<div className="p-4 bg-white rounded-full">
								<Image
									src={item.icon}
									width={24}
									height={24}
									alt={item.label}
								/>
							</div>
							<p className="text-white">{item.label}</p>
						</li>
					))}
				</ul>
			</section>
			<section>
				<Collection
					// hamesha search nhi dikhana
					hasSearch={true}
					images={images?.data}
					totalPages={images?.totalPage}
					page={page}
				/>
			</section>
		</main>
	);
}
