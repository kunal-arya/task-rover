"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, BoardId } = data;
  let updatedCards;

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    updatedCards = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: updatedCards };
};

export const updateCardOrder = createSafeActions(UpdateCardOrder, handler);
