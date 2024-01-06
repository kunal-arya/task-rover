"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeActions } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id, BoardId } = data;
  let List;

  try {
    List = await db.list.update({
      where: {
        id,
        BoardId,
        board: {
          orgId, // preventing anyone from outside this org to perform this action
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityTitle: List.title,
      entityId: List.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: List };
};

export const updateList = createSafeActions(UpdateList, handler);
