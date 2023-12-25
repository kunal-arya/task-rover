import { cn, headingFont } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"



export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image
                    src="/logo.svg"
                    alt="logo"
                    height={30}
                    width={30}
                    style={{ width: "auto", height: "auto" }}
                />
                <p className={cn("text-lg text-neutral-700 pt-1", headingFont.className)}>
                    Task Rover
                </p>
            </div>
        </Link>
    )
}