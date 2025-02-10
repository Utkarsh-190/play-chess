import { useEffect, useRef, useState } from "react";
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

    const movesContainerRef = useRef(null);

    console.log("moves: ", chess.history({verbose: true}))
    console.log("pgn: ", chess.pgn())

    const runBots = () => {
        let intervalId = setInterval(() => {
            if(chess.isGameOver()){
                console.log("game over made by bot");
                // alert("Game Over!!");
            } else {
                const moves = chess.moves()
                const move = moves[Math.floor(Math.random() * moves.length)]
                console.log("curMove: ", move);
                chess.move(move)
                console.log("made a move: ", move);
                setBoard(chess.board());
            }
        }, 200);
        setTimeout(() => {
            console.log("clearing interval")
            clearInterval(intervalId);
        }, 10000);
    }

    useEffect(() => {
        const movesContainer = movesContainerRef.current as HTMLDivElement | null;
        if(movesContainer){
            console.log("movesContainer: ");
            console.dir(movesContainer);
            movesContainer.scrollTop = movesContainer.scrollHeight;
        }
    }, [board]);

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
    }, [socket]);

    const flipBoard = () => {
        board.map(row => row.reverse());
        board.reverse();
    }

    // if(!socket) return <div className="text-white">Connecting...</div>

    return <div className="h-full p-10 text-white grid grid-cols-3 gap-4 justify-items-center">
        <div className="col-span-2 flex">
            <Chessboard board={board} setBoard={setBoard} chess={chess} socket={socket}/>
            <div className="m-1">
                <img onClick={flipBoard} src={"/flip.svg"} alt="flip board icon" 
                className="w-8 p-1 rotate-90 rounded cursor-pointer hover:bg-sky-500/25 "/>
            </div>
        </div>
        <div className="h-full col-span-1 flex flex-col items-center">
            <div className=" m-2 h-[10%]">
                <Button onClick={() => {
                    console.log("game started")
                    // TODO: remove runBots later
                    runBots();
                    // TODO: remove ? in 'socket?.' and handle if it can be null
                    socket?.send(JSON.stringify({
                        type: INIT_GAME
                    }))
                }}>
                    Join Game
                </Button>
            </div>
            <div className="w-85 h-[90%] flex flex-col">
                <div className="text-center text-xl bg-sky-900">Moves</div>
                <div ref={movesContainerRef} className="h-140 bg-sky-800 overflow-auto flex flex-wrap content-start">
                    {chess.history({verbose: true}).map((move, index) => {
                        return <div className="h-8 flex items-center border-1 border-slate-500">
                            {index%2 == 0 && <span className="w-8 pt-[3px] h-full text-center bg-sky-900">{index/2 + 1}</span>}
                            <div key={index} className="w-35 flex justify-center">
                                <span>{move.san}</span>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>
}