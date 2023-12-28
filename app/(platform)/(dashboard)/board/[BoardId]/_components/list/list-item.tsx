"use client"
import { ElementRef, useRef, useState } from "react";
import {
    Draggable, Droppable
} from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { cn } from "@/lib/utils";

import { ListHeader } from "./list-header";
import { CardForm } from "../card/card-form";
import { CardItem } from "../card/card-item";

type ListItemProps = {
    list: ListWithCards;
    index: number;
}

export const ListItem = (
    { list, index }:
        ListItemProps) => {
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setEditing] = useState(false);

    const disableEditing = () => {
        setEditing(false);
    }

    const enableEditing = () => {
        setEditing(true);
        // Using setTimeout to schedule the focus operation in the next event loop cycle
        // This ensures that the focus operation is executed after the current synchronous code
        setTimeout(() => {
            textareaRef.current?.focus();
        })
    }

    return (
        <Draggable
            draggableId={list.id} index={index}
        >
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="shrink-0 h-full w-[272px] select-none">
                    <div
                        {...provided.dragHandleProps}
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                        <ListHeader
                            onAddCard={enableEditing}
                            list={list}
                        />
                        <Droppable
                            droppableId={list.id}
                            type="card"
                        >
                            {(provided) => (
                                <ol
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                        list.cards.length ? "mt-2" : "mt-0"
                                    )}
                                >
                                    {
                                        list.cards.map((card, index) => (
                                            <CardItem
                                                index={index}
                                                key={card.id}
                                                data={card}
                                            />
                                        ))
                                    }
                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm
                            listId={list.id}
                            ref={textareaRef}
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                        />
                    </div>
                </li>
            )}
        </Draggable>

    )
}