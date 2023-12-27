import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { Deleteboard } from "./schema";

export type InputType = z.infer<typeof Deleteboard>;
export type ReturnType = ActionState<InputType, Board>;
