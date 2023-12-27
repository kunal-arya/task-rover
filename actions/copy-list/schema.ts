import { z } from "zod";

export const CopyList = z.object({
  id: z.string(),
  BoardId: z.string(),
});
