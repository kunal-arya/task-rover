import { AppRoutes } from "@/lib/constant"
import { OrganizationList } from "@clerk/nextjs"

const CreateOrganizationPage = () => {
    return (
        <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl={AppRoutes.ORGANIZATION_ID}
            afterCreateOrganizationUrl={AppRoutes.ORGANIZATION_ID}
        />
    )
}

export default CreateOrganizationPage