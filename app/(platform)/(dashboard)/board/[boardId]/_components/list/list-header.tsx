"use client"

import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

import { List } from "@prisma/client";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { updateList } from "@/actions/update-list";


type ListHeaderProps = {
    list: List;
}

export const ListHeader = ({ list }: ListHeaderProps) => {
    const [title, setTitle] = useState(list.title);
    const [isEditing, setEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        setEditing(true);

        // Using setTimeout to schedule the focus operation in the next event loop cycle
        // This ensures that the focus operation is executed after the current synchronous code
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () => {
        setEditing(false);
    }

    const { execute } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    })

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef?.current?.requestSubmit();
        }
    }

    useEventListener("keydown", onKeyDown);

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        if (title === list.title) {
            return disableEditing();
        }

        execute({
            title,
            id: list.id,
            BoardId: list.BoardId
        })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ?
                <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="Enter list title..."
                        defaultValue={title}
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                    />
                    <button type="submit" hidden />
                </form> :
                <div
                    onClick={enableEditing}
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                    {title}
                </div>
            }

        </div>
    )
}
