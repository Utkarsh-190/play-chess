import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export declare type Cell = {
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null;

export const Chessboard = ({board, setBoard, chess, socket}: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][], setBoard: any, chess: any, socket: WebSocket
}) => {
    console.log("board: ", board);
    const [from, setFrom] = useState<Square>();
    const [to, setTo] = useState<Square>();

    const handleCellClick = (cell: Cell, curCellLocation: Square) => {
        console.log("cell clicked: ", cell);
        console.log("or: ", curCellLocation);

        if(!from){
            setFrom(curCellLocation);
        } else {
            setTo(curCellLocation);
            const curMove = {
                from: from,
                to: curCellLocation
            };
            setFrom(undefined);

            chess.move(curMove);
            setBoard(chess.board());
            socket.send(JSON.stringify({
                type: MOVE,
                move: curMove
            }))
        }
    }

    return (
        <div className="flex flex-col">
            {board.map((row, i) => {
                return <div key={i} className="w-160 flex items-baseline">
                    {row.map((cell, j) => {
                        const curCellLocation = String.fromCharCode(97 + (j%8)) + String(8 - (i)) as Square;
                        return <div key={j} 
                                onClick={() => {handleCellClick(cell, curCellLocation)}}
                                className={`w-20 h-20 flex justify-center items-center 
                                ${cell?.color=='w'?"text-white":"text-black"} ${(i+j)%2==0?"bg-sky-300":"bg-sky-600"}`}>
                            <span>{cell?.type}</span>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}
