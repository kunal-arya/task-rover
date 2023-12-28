"use client"

import { useEffect, useState } from "react";

import {
    DragDropContext, DropResult, Droppable
} from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { UpdateListOrder } from "@/actions/update-list-order/schema";
import { toast } from "sonner";

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

type ListContainerProps = {
    lists: ListWithCards[],
    BoardId: string;
}

export const ListContainer = ({
    lists, BoardId
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(lists);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        }
    })

    useEffect(() => {
        setOrderedData(lists);
    }, [lists]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // if Dropped in the same position
        if (
            destination.droppableId === source.droppableId && destination.index === source.index
        ) {
            return;
        }

        // User moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items);
            // updating to the server
            executeUpdateListOrder({ items, BoardId });
        }

        // User moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destList) {
                return;
            }

            // Check If Cards exists on the sourceList
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // Check If Cards exists on the destList
            if (!destList.cards) {
                destList.cards = [];
            }

            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                )

                reorderedCards.forEach((card, index) => {
                    card.order = index;
                })

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                // TODO: Trigger server action
            } else {
                // User Moves the card to another list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                })

                // Update the order for each card in the destination list
                destList.cards.forEach((card, index) => {
                    card.order = index;
                })

                setOrderedData(newOrderedData);
                // TODO: Trigger Server Action
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId="lists"
                type="list"
                direction="horizontal"
            >
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full">
                        {orderedData.map((list, index) => (
                            <ListItem
                                key={list.id}
                                index={index}
                                list={list}
                            />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}
