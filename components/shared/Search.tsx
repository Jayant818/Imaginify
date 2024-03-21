"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const Search = () => {
	const [query, setQuery] = useState("");
	const router = useRouter();
	const SearchParam = useSearchParams();

	useEffect(() => {
		const delayDeboundfn = setTimeout(() => {
			if (query) {
				const newUrl = formUrlQuery({
					searchParams: SearchParam.toString(),
					key: "query",
					value: query,
				});

				router.push(newUrl, { scroll: false });
			} else {
				const newUrl = removeKeysFromQuery({
					searchParams: SearchParam.toString(),
					keysToRemove: ["query"],
				});
			}
		}, 300);
	}, [query, router, SearchParam]);

	// function to make the api changes after some time and applying them to the URL

	return (
		<>
			<div className="flex w-full  border-[2px] border-purple-200/20 bg-white px-4 shadow-md shadow-purple-200/15 md:max-w-96 rounded-md ">
				{/* Search Bar */}
				<Image
					src="/assets/icons/search.svg"
					alt="search"
					width={24}
					height={24}
				/>

				<Input
					placeholder="Search..."
					className="border-0 bg-transparent w-full h-[50px] focus-visible:ring-offset-0 focus-visible:ring-transparent px-6 text-dark-600 placeholder:text-dark-400 "
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
			</div>
		</>
	);
};

export default Search;
