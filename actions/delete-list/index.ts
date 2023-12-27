"use server";
import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { createSafeActions } from "@/lib/create-safe-action";

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
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${BoardId}`);
  return { data: list };
};

export const deleteList = createSafeActions(DeleteList, handler);
