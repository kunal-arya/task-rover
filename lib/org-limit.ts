import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const availableCount = async (count: "increase" | "decrease") => {
  const { orgId } = auth();

  try {
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
      where: { orgId },
    });

    if (orgLimit) {
      if (count === "increase") {
        await db.orgLimit.update({
          where: { orgId },
          data: { count: orgLimit.count + 1 },
        });
      } else {
        await db.orgLimit.update({
          where: { orgId },
          data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
        });
      }
    } else {
      await db.orgLimit.create({
        data: { orgId, count: 1 },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const hasAvailableCount = async () => {
  const { orgId } = auth();

  try {
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const orgLimit = await db.orgLimit.findUnique({
      where: { orgId },
    });

    if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0;
  }

  try {
    const orgLimit = await db.orgLimit.findUnique({
      where: {
        orgId,
      },
    });

    return orgLimit ? orgLimit?.count : 0;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
