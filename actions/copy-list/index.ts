"use server";
import { revalidatePath } from "next/cache";

import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeActions } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";

import { InputType, ReturnType } from "./types";
import { CopyList } from "./schema";

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
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        BoardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await db.list.findFirst({
      where: { BoardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        BoardId: listToCopy.BoardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/organization/${BoardId}`);
  return { data: list };
};

export const copyList = createSafeActions(CopyList, handler);
