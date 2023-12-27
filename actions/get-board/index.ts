"use server";

import { db } from "@/lib/db";

export const getBoardWithOrgIdnId = async (id: string, orgId: string) => {
  try {
    return await db.board.findUnique({
      where: {
        id,
        orgId,
      },
    });
  } catch (err) {
    return {
      error: err,
    };
  }
};
