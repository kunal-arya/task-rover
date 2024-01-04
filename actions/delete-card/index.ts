"use server";
import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeActions } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeleteCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, BoardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${BoardId}`);
  return { data: card };
};

export const deleteCard = createSafeActions(DeleteCard, handler);
