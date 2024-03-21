"use client";
import { CldImage, getCldImageUrl } from "next-cloudinary";

import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";

import { type } from "os";
import React from "react";
import { Button } from "../ui/button";

const TransformedImage = ({
	image,
	isTransforming,
	setIsTransforming,
	transformationConfig,
	hasDownload = false,
	type,
	title,
}: TransformedImageProps) => {
	const handleDownload = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		download(
			getCldImageUrl({
				width: image?.width,
				height: image?.height,
				src: image?.publicId,
				...transformationConfig,
			}),
			title
		);
	};
	return (
		<div className="w-full lg:w-1/2 flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<h3 className="text-2xl font-semibold leading-none tracking-tight text-dark-600">
					Transformed Image
				</h3>
				{hasDownload && (
					<button onClick={handleDownload}>
						<Image
							src="/assets/icons/download.svg"
							width={24}
							height={24}
							alt="Download Image"
						/>
					</button>
				)}
			</div>
			{image?.publicId && transformationConfig ? (
				<div className="relative">
					<CldImage
						width={getImageSize(type, image, "width")}
						height={getImageSize(type, image, "height")}
						src={image?.publicId}
						alt={image.title}
						sizes={"(max-width: 767px) 100vw, 50vw"}
						placeholder={dataUrl as PlaceholderValue}
						className="transformed-image"
						// TransfornationConfig is the object that contains the transformation details
						// like the type of transformation, the color, the amount etc.
						onLoad={() => setIsTransforming && setIsTransforming(false)}
						onError={debounce(() => {
							setIsTransforming && setIsTransforming(false);
						}, 8000)}
						{...transformationConfig}
					/>

					{/* 
                        Loader
                    */}

					{isTransforming && (
						<div className="w-full  h-[170px] flex justify-center items-center shadow-md shadow-purple-400/20  rouded-md">
							<Image
								src="/public/assets/icons/spinner.svg"
								width={50}
								height={50}
								alt="Loading"
							/>
							<p className="text-dark-400">Loading....</p>
						</div>
					)}
				</div>
			) : (
				<div className="w-full  h-[170px] flex justify-center items-center shadow-md shadow-purple-400/20  rouded-md">
					<p className="text-dark-600 ">Transformed Image</p>
				</div>
			)}
		</div>
	);
};

export default TransformedImage;
