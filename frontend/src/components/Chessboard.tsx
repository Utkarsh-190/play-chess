import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export declare type Cell = {
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null;

export function isPromoting(chess: Chess, from: Square, to: Square) {
    if (!from) {
      return false;
    }
  
    const piece = chess.get(from);
    if (piece?.type !== 'p') {
      return false;
    }
    if (piece.color !== chess.turn()) {
      return false;
    }
    if (!['1', '8'].some((it) => to.endsWith(it))) {
      return false;
    }
    console.log("chess.moves({ square: from, verbose: true }): ", chess.moves({ square: from, verbose: true }))
    return chess
            .moves({ square: from, verbose: true })
            .map((it) => it.to)
            .includes(to);
  }

export const Chessboard = ({board, setBoard, chess, socket}: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][], setBoard: any, chess: any, socket: WebSocket | null
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
            const isPromotingResult = isPromoting(chess, from, curCellLocation)
            console.log("isPromotingResult", isPromotingResult);
            const curMove = {
                from: from,
                to: curCellLocation,
                promotion: isPromotingResult ? 'q' : null
            };
            setFrom(undefined);

            chess.move(curMove);
            setBoard(chess.board());
            // TODO: remove ? in 'socket?.' and handle if it can be null
            socket?.send(JSON.stringify({
                type: MOVE,
                move: curMove
            }))
        }
    }

    return (
        <div className="flex flex-col">
            {board.map((row, i) => {
                return <div key={i} className="w-160 flex">
                    {row.map((cell, j) => {
                        const curCellLocation = String.fromCharCode(97 + (j%8)) + String(8 - (i)) as Square;
                        return <div key={j} 
                                onClick={() => {handleCellClick(cell, curCellLocation)}}
                                className={`w-20 h-20 flex justify-center items-center 
                                ${(i+j)%2==0?"bg-sky-300":"bg-sky-600"}`}>
                            <span>
                                {/* {cell?.type} */}
                                {cell && <img src={`${cell?.type}${cell?.color == 'w' ? "" : " black"}.svg`} alt="chess piece" />}
                            </span>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}
