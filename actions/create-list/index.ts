"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
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
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: list };
};

export const createList = createSafeActions(CreateList, handler);
