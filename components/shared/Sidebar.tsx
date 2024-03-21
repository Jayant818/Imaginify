"use client";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className="hidden w-72 p-4 lg:flex h-screen fixed lg:flex-col   shadow-md shadow-purple-200">
			<Link href="/">
				<Image src="/logo.png" width={180} height={38} alt="Logo" />
			</Link>
			<nav className="h-full flex flex-col justify-between mt-4">
				{/* <nav> */}
				<SignedIn>
					<ul className="flex flex-col gap-1 mt-2">
						{navLinks.slice(0, 6).map((link) => {
							const isActive = link.route === pathname;
							return (
								<li
									key={link.route}
									className={`p-4 ${
										isActive && "bg-purple-gradient text-white"
									} rounded-md`}
								>
									<Link href={link.route} className="flex gap-2">
										<Image
											src={link.icon}
											alt="logo"
											width={24}
											height={24}
											className={`${isActive && "brightness-200"}`}
										/>
										<p>{link.label}</p>
									</Link>
								</li>
							);
						})}
					</ul>

					<ul className="flex flex-col gap-1 mt-2 justify-start">
						{navLinks.slice(6).map((link) => {
							const isActive = link.route === pathname;
							return (
								<li
									key={link.route}
									className={`p-4 ${
										isActive && "bg-purple-gradient"
									} rounded-md`}
								>
									<Link href={link.route} className="flex gap-2">
										<Image
											src={link.icon}
											width={24}
											height={24}
											alt={link.label}
										/>
										<p
											className={`text-gray-600 hover:text-gray-800 ${
												isActive && "text-white"
											}`}
										>
											{link.label}
										</p>
									</Link>
								</li>
							);
						})}
						<li className="flex-center cursor-pointer gap-2 p-4">
							<UserButton afterSignOutUrl="/" showName />
						</li>
					</ul>
				</SignedIn>
				<SignedOut>
					<Button asChild className="bg-purple-700 bg-cover">
						<Link href="/sign-in">Sign In</Link>
					</Button>
				</SignedOut>
			</nav>
		</aside>
	);
};

export default Sidebar;
