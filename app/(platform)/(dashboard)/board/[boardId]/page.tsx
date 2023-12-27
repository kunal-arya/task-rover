import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list/list-container";


type BoardIdPageProps = {
    params: {
        boardId: string;
    }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect(`/select-org`);
    }

    const lists = await db.list.findMany({
        where: {
            BoardId: params.boardId,
            board: {
                orgId
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc"
                }
            }
        },
        orderBy: {
            order: "asc"
        }
    })

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={params.boardId}
                lists={lists}
            />
        </div>
    )
}

export default BoardIdPage