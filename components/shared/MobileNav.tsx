"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
	const pathname = usePathname();
	return (
		<nav className="w-full p-4 lg:hidden flex justify-between items-center shadow-md shadow-purple-200">
			<Image src="/logo.png" width={180} height={38} alt="Logo" />
			<SignedIn>
				<div className="flex gap-4">
					<UserButton afterSignOutUrl="/" />
					<Sheet>
						<SheetTrigger asChild>
							<Image
								src="/assets/icons/menu.svg"
								width={24}
								height={24}
								alt="Menu"
								className="cursor-pointer"
							/>
						</SheetTrigger>
						<SheetContent>
							<Image src="/logo.png" width={180} height={38} alt="Logo" />
							<ul className="flex flex-col gap-1 mt-8">
								{navLinks.map((link) => {
									const isActive = link.route === pathname;
									return (
										<li
											key={link.route}
											className={`p-4 ${
												isActive && "bg-purple-gradient text-white"
											} 
                                            hover:text-purple-500
                                            rounded-md`}
										>
											<Link href={link.route} className="flex gap-2">
												<Image
													src={link.icon}
													alt="logo"
													width={24}
													height={24}
													className={`${isActive && "brightness-200"} `}
												/>
												<p className="">{link.label}</p>
											</Link>
										</li>
									);
								})}
							</ul>
						</SheetContent>
					</Sheet>
				</div>
			</SignedIn>
			<SignedOut>
				<Button asChild className="bg-purple-500 rounded-md ">
					<Link href="/signin">Sign in</Link>
				</Button>
			</SignedOut>
		</nav>
	);
};

export default MobileNav;
