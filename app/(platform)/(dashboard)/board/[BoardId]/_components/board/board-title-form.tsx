"use client"

import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";

type BoardTitleFormProps = {
    board: Board;
}

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board "${data.title} updated!"`)
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [title, setTitle] = useState(board.title);
    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);

        // Using setTimeout to schedule the focus operation in the next event loop cycle
        // This ensures that the focus operation is executed after the current synchronous code
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () => {
        setIsEditing(false);
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        execute({
            title,
            id: board.id,
        })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    if (isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput
                    ref={inputRef}
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p1- px-2"
            onClick={enableEditing}
        >
            {title}
        </Button>
    )
}
