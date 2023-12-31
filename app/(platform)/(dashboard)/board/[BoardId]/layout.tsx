import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board/board-navbar";
import { getBoardWithOrgIdnId } from "@/actions/get-board";


export async function generateMetadata({
    params
}: { params: { BoardId: string } }) {
    const { orgId } = auth();

    if (!orgId) {
        return {
            title: "Board"
        }
    }

    const board = await getBoardWithOrgIdnId(params.BoardId, orgId)

    return {
        title: board?.title || "Board"
    }
}

const BoardIdLayout = async ({ children, params }: {
    children: React.ReactNode, params: {
        BoardId: string
    }
}) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await getBoardWithOrgIdnId(params.BoardId, orgId);

    if (!board) {
        // Not Found page will trigger
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar board={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout