"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	aspectRatioOptions,
	creditFee,
	defaultValues,
	transformationTypes,
} from "@/constants";
import CustomField from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";
import { updateCredit } from "@/lib/actions/user.actions";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";

export const formSchema = z.object({
	title: z.string(),
	// for image resizing
	aspectRatio: z.string().optional(),
	// for color change
	color: z.string().optional(),
	// object to remove
	prompt: z.string().optional(),
	publicId: z.string(),
});

const TransformationForm = ({
	action,
	data = null,
	userId,
	type,
	creditBalance,
	config = null,
}: TransformationFormProps) => {
	const transformationType = transformationTypes[type];
	const [image, setImage] = useState(data);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isTransforming, setIsTransforming] = useState(false);
	const [newTransformation, setNewTransformation] =
		useState<Transformations | null>(null);
	// This line uses the useTransition hook from React, which allows you to mark a state transition as a non-blocking transition. It helps improve the perceived performance of your application by allowing React to pause the rendering of this transition if there are more urgent updates or user interactions.
	// The useTransition hook returns an array with two values: pending (a boolean indicating if a transition is currently in progress) and startTransition (a function to initiate a non-blocking transition).
	const [pending, startTransition] = useTransition();
	const [transformationConfig, setTransformationConfig] = useState(config);

	const router = useRouter();

	// setting inital values agar action updated hai means we have already data and we have to update that
	const initialValues =
		data && action === "Update"
			? {
					title: data?.title,
					aspectRatio: data?.aspectRatio,
					color: data?.color,
					prompt: data?.prompt,
					publicId: data?.publicId,
			  }
			: defaultValues;

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);

		//is submitting true
		setIsSubmitting(true);

		// data in the case hum update kar rahe hai image
		if (data || image) {
			//transforming the image
			const transformationURL = getCldImageUrl({
				width: image?.width,
				height: image?.height,
				src: image.publicId,
				...transformationConfig,
			});

			const imageData = {
				title: values.title,
				transformationType: type,
				publicId: image?.publicId,
				secureURL: image?.secureURL,
				width: image?.width,
				height: image?.height,
				config: transformationConfig,
				transformationURL,
				aspectRatio: values.aspectRatio,
				color: values.color,
				prompt: values.color,
			};

			// // ab hamare actions multiple types k honge ya to hum add kar rahe honge image ya fir update kar rahe honge

			if (action === "Add") {
				try {
					// do some opertion - update the state
					// add that to db
					// pass the transformation configs
					const newImage = await addImage({
						image: imageData,
						userId,
						path: "/",
					});

					if (newImage) {
						form.reset();
						setImage(data);
						router.push(`/transformations/${newImage._id}`);
					}
				} catch (error) {
					console.error(error);
				}
			}

			if (action === "Update") {
				try {
					//phle se hi image hai to update kar do bas
					const updatedImage = await updateImage({
						image: {
							...imageData,
							_id: data._id,
						},
						userId,
						path: `/transformations/${data._id}`,
					});
				} catch (error) {
					console.error(error);
				}
			}
		}
		setIsSubmitting(false);
	}

	const onInputChangeHandler = (
		fieldName: string,
		value: string,
		type: string,
		onChangeField: (value: string) => void
	) => {
		// delay provide karta hai means ki state baar baar change na ho after every 1000 seconds.
		debounce(() => {
			// isko hum fill up kar rahe hai ye hai ek image pe kis kis type k transformations laga rakhe hai
			// declare type Transformations = {
			// 	restore?: boolean;
			// 	fillBackground?: boolean;
			// 	remove?: {
			// 		prompt: string;
			// 		removeShadow?: boolean;
			// 		multiple?: boolean;
			// 	};
			// 	recolor?: {
			// 		prompt?: string;
			// 		to: string;
			// 		multiple?: boolean;
			// 	};
			// 	removeBackground?: boolean;
			// };
			setNewTransformation((prevState: any) => ({
				...prevState,
				[type]: {
					...prevState?.[type],
					[fieldName === "prompt" ? "prompt" : "to"]: value,
				},
			}));
		}, 1000)();

		return onChangeField(value);
	};

	// 	The flow of execution is as follows:

	// When the onTransformHandler function is called, it sets the isTransforming state to true.
	// It updates the transformationConfig state by merging the newTransformation object with the existing configuration.
	// It resets the newTransformation state to null.
	// It initiates a non-blocking transition using startTransition.
	// Inside the transition callback, the updateCredits operation (which might be an expensive or time-consuming operation) is performed.

	const onTransformHandler = () => {
		setIsTransforming(true);

		setTransformationConfig(
			// merge kar rahe hai dono image ki transformations config unko ki image mai kya kya hoga
			deepMergeObjects(newTransformation, transformationConfig)
		);
		// null set kar diya fir usko
		setNewTransformation(null);

		// The purpose of using useTransition in this context is to ensure that the application remains responsive and doesn't freeze or become janky while performing the potentially expensive operation of updating the user's credits (updateCredits).
		startTransition(async () => {
			await updateCredit(userId, -1);
		});
	};

	const onSelectFieldHandler = (
		value: string,
		onChangeField: (value: string) => void
	) => {
		const imageSize = aspectRatioOptions[value as AspectRatioKey];

		setImage((prevState: any) => ({
			...prevState,
			aspectRatio: imageSize.aspectRatio,
			width: imageSize.width,
			height: imageSize.height,
		}));

		// type: "removeBackground",
		// title: "Background Remove",
		// subTitle: "Removes the background of the image using AI",
		// config: { removeBackground: true },
		// icon: "camera.svg",

		setNewTransformation(transformationType.config);

		return onChangeField(value);
	};

	useEffect(() => {
		if (
			image &&
			(type === "restore" || type === "remove" || type === "removeBackground")
		) {
			setNewTransformation(transformationType.config);
		}
	}, [image, type, transformationType.config]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

				{/* Image Title */}
				<CustomField
					control={form.control}
					name="title"
					formLabel="Image Title"
					className="w-full"
					render={({ field }) => (
						<Input
							{...field}
							className=" rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16 font-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3  focus-visible:ring-transparent !important"
						/>
					)}
				/>

				{/* Aspect Ratio mang rahe hai if type ===fill hai to */}
				{type === "fill" && (
					<CustomField
						control={form.control}
						name="aspectRatio"
						formLabel="Aspect Ratio"
						className="w-full"
						render={({ field }) => (
							<Select
								onValueChange={(value: any) =>
									onSelectFieldHandler(value, field.onChange)
								}
								value={field.value}
							>
								<SelectTrigger className="w-full  rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16 font-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3  focus-visible:ring-transparent !important">
									<SelectValue placeholder="Select size" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(aspectRatioOptions).map((key) => (
										<SelectItem key={key} value={key} className="">
											{aspectRatioOptions[key as AspectRatioKey].label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				)}

				{/* remove/color konse object karna hai */}
				{(type === "remove" || type === "recolor") && (
					<div className="">
						<CustomField
							control={form.control}
							name="prompt"
							formLabel={
								type === "remove" ? "Object to remove" : "Object to recolor"
							}
							className="w-full"
							render={({ field }) => (
								<Input
									value={field.value}
									className=" rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16 font-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3  focus-visible:ring-transparent !important"
									onChange={(e) =>
										onInputChangeHandler(
											"prompt",
											e.target.value,
											type,
											field.onChange
										)
									}
								/>
							)}
						/>
					</div>
				)}

				{/* color konsa karu  */}

				{type === "recolor" && (
					<CustomField
						control={form.control}
						name="color"
						formLabel="Replacement Color"
						className="w-full"
						render={({ field }) => (
							<Input
								value={field.value}
								className=" rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 disabled:opacity-100 p-16 font-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3  focus-visible:ring-transparent !important"
								onChange={(e) =>
									onInputChangeHandler(
										"color",
										e.target.value,
										"recolor",
										field.onChange
									)
								}
							/>
						)}
					/>
				)}

				{/* cloudinary Image Upload */}
				<div className="flex w-full flex-col lg:flex-row lg:gap-10">
					<CustomField
						control={form.control}
						name="publicId"
						// formLabel="Image"
						className="flex flex-col w-full lg:w-1/2"
						render={({ field }) => (
							<MediaUploader
								onValueChange={field.onChange}
								type={type}
								image={image}
								setImage={setImage}
								publicId={field.value}
							/>
						)}
					/>

					<TransformedImage
						image={image}
						isTransforming={isTransforming}
						setIsTransforming={setIsTransforming}
						transformationConfig={transformationConfig}
						type={type}
						title={form.getValues().title}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<button
						type="button"
						className="cursor-pointer capitalize bg-purple-400 !important  text-white font-semibold rounded-full  w-full px-4 py-2 "
						disabled={isTransforming || newTransformation === null}
						onClick={onTransformHandler}
					>
						{isTransforming ? "Transforming..." : "Apply Transformation"}
					</button>
					<button
						type="submit"
						className="capitalize bg-purple-700 text-white font-bold rounded-full  w-full px-4 py-2 "
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Save Image"}
					</button>
				</div>
			</form>
		</Form>
	);
};

export default TransformationForm;
