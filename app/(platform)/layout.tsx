import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner";

const PlatformLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    )
}

export default PlatformLayout