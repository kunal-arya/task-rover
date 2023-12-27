import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { Updateboard } from "./schema";

export type InputType = z.infer<typeof Updateboard>;
export type ReturnType = ActionState<InputType, Board>;
