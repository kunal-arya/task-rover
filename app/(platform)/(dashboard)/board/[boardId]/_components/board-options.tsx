"use client"

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react";


type BoardOptionsProps = {
    id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
        </Popover>
    )
}
