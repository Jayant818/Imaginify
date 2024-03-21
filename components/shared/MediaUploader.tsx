"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { CldImage } from "next-cloudinary";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploaderProps = {
	onValueChange: (value: string) => void;
	type: string;
	image: any;
	setImage: React.Dispatch<any>;
	publicId: string;
};

const MediaUploader = ({
	onValueChange,
	type,
	image,
	setImage,
	publicId,
}: MediaUploaderProps) => {
	const { toast } = useToast();

	const onUploadSuccessHandler = (result: any) => {
		// public id set karni hai
		// image set karni hai
		setImage((prevState: any) => ({
			...prevState,
			publicId: result?.info?.public_id,
			width: result?.info?.width,
			height: result?.info?.height,
			secureURL: result?.info?.secure_url,
		}));

		onValueChange(result?.info?.public_id);

		toast({
			title: "Image Uploaded",
			description: "1 credit is deducted from your credits.",
			duration: 5000,
			className: "bg-green-500 text-white",
		});
	};

	const onUploadErrorHandler = (error: any) => {
		toast({
			title: "Error",
			description: "Error uploading the image",
			duration: 5000,
			className: "bg-red-500 text-white",
		});
	};

	return (
		<CldUploadWidget
			uploadPreset="Jayant_imaginify"
			options={{
				multiple: false,
				resourceType: "image",
			}}
			onSuccess={onUploadSuccessHandler}
			onError={onUploadErrorHandler}
		>
			{({ open }) => {
				return (
					<div className="w-full flex flex-col gap-4 ">
						<h3 className="text-2xl font-semibold leading-none tracking-tight text-dark-600">
							Original
						</h3>

						{publicId ? (
							<div>
								<CldImage
									// calculate kar rahe hai width or heigh on basis of the type and aspect ratio chosen
									width={getImageSize(type, image, "width")}
									height={getImageSize(type, image, "height")}
									src={publicId}
									alt="image"
									// responsive sizing bata di
									sizes={"(max-width: 767px) 100vw, 50vw"}
									// plavceholder mai ek image bata di
									placeholder={dataUrl as PlaceholderValue}
									className="media-uploader_cldImage"
								/>
							</div>
						) : (
							<div
								className="w-full h-[170px] flex flex-col gap-4 justify-center items-center shadow-md shadow-purple-400/20 rounded-md"
								onClick={() => open()}
							>
								<div className="p-2 rounded-md shadow-md shadow-purple-400/25 cursor-pointer">
									<Image
										src="/assets/icons/add.svg"
										width={24}
										height={24}
										alt="Add"
									/>
								</div>
								<p className="text-sm text-dark-400">
									Click to Upload the image
								</p>
							</div>
						)}
					</div>
				);
			}}
		</CldUploadWidget>
	);
};

export default MediaUploader;
