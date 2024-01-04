import { z } from "zod";

export const CopyCard = z.object({
  id: z.string(),
  BoardId: z.string(),
});
