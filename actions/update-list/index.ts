"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
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
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board/${BoardId}`);
  return { data: List };
};

export const updateList = createSafeActions(UpdateList, handler);
