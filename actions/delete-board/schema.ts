import { z } from "zod";

export const Deleteboard = z.object({
  id: z.string(),
});
