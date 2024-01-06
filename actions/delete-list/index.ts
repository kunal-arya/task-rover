"use server";
import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createSafeActions } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

import { InputType, ReturnType } from "./types";
import { DeleteList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, BoardId } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        BoardId,
        board: {
          orgId, // preventing anyone from outside this org to perform this action
        },
      },
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${BoardId}`);
  return { data: list };
};

export const deleteList = createSafeActions(DeleteList, handler);
