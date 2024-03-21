import MobileNav from "@/components/shared/MobileNav";
import Sidebar from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
			<MobileNav />
			<Sidebar />
			<div className=" w-full h-full ">
				<div className=" w-full mt-10 py-8 md:py-8  md:mt-0 lg:pl-[250px]  overflow-auto flex flex-col lg:flex-row gap-2">
					{children}
				</div>
			</div>
			<Toaster />
		</main>
	);
};

export default Layout;
