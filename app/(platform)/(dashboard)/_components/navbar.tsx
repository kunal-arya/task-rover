import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { AppRoutes } from "@/lib/constant"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Plus } from "lucide-react"

export const Navbar = () => {
    return (
        <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
            {/* TODO: Mobile Sidebar */}
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <Button size="sm" variant="primary" className="rounded-sm h-auto py-1.5 px-2">
                    <span className="md:block hidden">
                        Create
                    </span>
                    <span className="block md:hidden">
                        <Plus className="h-4 w-4" />
                    </span>
                </Button>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl={AppRoutes.ORGANIZATION_ID}
                    afterLeaveOrganizationUrl={AppRoutes.SELECT_ORG}
                    afterSelectOrganizationUrl={AppRoutes.ORGANIZATION_ID}
                    appearance={{
                        elements: {
                            rootBox: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }
                    }}
                />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: {
                                height: 30,
                                width: 30
                            }
                        }
                    }}
                />
            </div>
        </nav>
    )
}