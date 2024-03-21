import React from "react";

const Headers = ({ title, subtitle }: { title: string; subtitle?: string }) => {
	return (
		<>
			<h2 className="text-3xl md:text-5xl tracking-tight font-extrabold text-dark-600 leading-[110%]">
				{title}
			</h2>
			{subtitle && (
				<p className=" mt-2 text-dark-400 font-normal text-[16px] lg:text-[20px] leading-[140%]">
					{subtitle}
				</p>
			)}
		</>
	);
};

export default Headers;
