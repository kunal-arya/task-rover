import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

type Props = {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
};

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found");
    }

    const { entityId, entityTitle, entityType, action } = props;

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (err) {
    console.log(`[AUDIT LOG ERROR]`, err);
  }
};
