"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { BoardId, items } = data;
  let lists;

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          },
        },
        // which data is used to update
        data: {
          order: list.order,
        },
      })
    );

    lists = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: lists };
};

export const updateListOrder = createSafeActions(UpdateListOrder, handler);
