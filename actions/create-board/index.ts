"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeActions } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Uauthorized",
    };
  }

  const { title } = data;

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
      },
    });
  } catch (err) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeActions(CreateBoard, handler);
