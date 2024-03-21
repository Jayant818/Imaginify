import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import {
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

type CustomFieldProps = {
	control: Control<z.infer<typeof formSchema>> | undefined;
	render: (props: { field: any }) => React.ReactNode;
	name: keyof z.infer<typeof formSchema>;
	formLabel?: string;
	className?: string;
};

const CustomField = ({
	name,
	formLabel,
	className,
	control,
	render,
}: CustomFieldProps) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{formLabel && <FormLabel>{formLabel}</FormLabel>}
					<FormControl>{render({ field })}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		></FormField>
	);
};

export default CustomField;
