import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { useSocket } from "../hooks/useSocket";
import {Chess} from 'chess.js';
import { Chessboard } from "../components/Chessboard";

// TODO: move together, same also present in Messages.ts file in backend
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    // TODO: remove board state as we can use chess.board() everywhere
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if(!socket) return;
        socket.onmessage = (event) => {
            console.log("event received: ", event);
            const message = JSON.parse(event.data)
            console.log("message received: ", message);

            switch (message.type) {
                case INIT_GAME:
                    console.log("game initialized");
                    setChess(new Chess());
                    setBoard(chess.board())
                    break;
                case MOVE:
                    console.log("move made");
                    chess.move(message.move);
                    setBoard(chess.board());
                    break;
                case GAME_OVER:
                    console.log("game over");
                    break;
            }
        }
    }, [socket])

    if(!socket) return <div className="text-white">Connecting...</div>

    return <div className="h-full p-10 text-white grid grid-cols-3 gap-4 justify-items-center">
        <div className="col-span-2">
            <Chessboard board={board} setBoard={setBoard} chess={chess} socket={socket}/>
        </div>
        <div className="col-span-1 flex items-center">
            <Button onClick={() => {
                console.log("game started")
                socket.send(JSON.stringify({
                    type: INIT_GAME
                }))
            }}>
                Play
            </Button>
        </div>
    </div>
}