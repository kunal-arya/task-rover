"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeActions } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateList } from "./schema";
import { getBoardWithOrgIdnId } from "../get-board";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, BoardId } = data;
  let list;

  try {
    const board = await getBoardWithOrgIdnId(BoardId, orgId);

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const lastList = await db.list.findFirst({
      where: { BoardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        BoardId: BoardId,
        order: newOrder,
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
      error: "Failed to create.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: list };
};

export const createList = createSafeActions(CreateList, handler);
