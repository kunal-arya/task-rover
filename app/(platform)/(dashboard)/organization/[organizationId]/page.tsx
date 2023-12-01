import { OrganizationSwitcher, auth } from "@clerk/nextjs";

const OrganizationIdPage = () => {
    const { userId, orgId } = auth();
    return (
        <OrganizationSwitcher
            hidePersonal
        />
    )
}

export default OrganizationIdPage