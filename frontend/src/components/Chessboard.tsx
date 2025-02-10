import { Chess, Color, PieceSymbol, QUEEN, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export declare type Piece = {
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null;

export declare type Move = {
    from: string;
    to: string;
    promotion?: string;
};

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
    return chess
            .moves({ square: from, verbose: true })
            .map((it) => it.to)
            .includes(to);
  }

export const Chessboard = ({board, setBoard, chess, socket, flipped, playerColor}: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][], setBoard: any, chess: Chess, socket: WebSocket | null, flipped: boolean, playerColor: Color | null
}) => {
    console.log("board: ", board);
    const [from, setFrom] = useState<Square>();

    const handleCellClick = (piece: Piece, curCellLocation: Square) => {
        if(chess.turn() !== playerColor) {
            console.log("chess.turn(): ", chess.turn());
            console.log("playerColor: ", playerColor);
            return;
        }
        console.log("piece clicked: ", piece);
        console.log("cell clicked: ", curCellLocation);

        if(piece && piece.color == chess.turn()) {
            setFrom(curCellLocation);
        } else if(from) {
            const isPromotingResult = isPromoting(chess, from, curCellLocation)
            const curMove: Move = {
                from: from,
                to: curCellLocation,
                promotion: isPromotingResult ? QUEEN : undefined
            };
            setFrom(undefined);

            try {
                console.log("move made by other player", curMove);
                chess.move(curMove);
                setBoard(chess.board());
                // TODO: remove ? in 'socket?.' and handle if it can be null
                socket?.send(JSON.stringify({
                    type: MOVE,
                    move: curMove
                }))
            } catch (error) {
                console.error("error: ", error);
            }
        }
    }

    return (
        <div className="flex flex-col">
            {board.map((row, i) => {
                const rowIndex = flipped ? 7 - i : i;
                return <div key={i} className="w-160 flex">
                    {board[rowIndex].map((col, j) => {
                        const colIndex = flipped ? 7 - j : j;
                        const piece = board[rowIndex][colIndex];
                        let curCellLocation = String.fromCharCode(97 + (colIndex%8)) + String(8 - (rowIndex)) as Square;
                        return <div key={j} 
                                onClick={() => {handleCellClick(piece, curCellLocation)}}
                                className={`w-20 h-20 flex justify-center items-center 
                                ${(i+j)%2==0?"bg-sky-300":"bg-sky-600"}
                                ${from == curCellLocation ? "border-2 border-white" : ""}`}>
                            <span>
                                {piece && <img src={`${piece?.type}${piece?.color == 'w' ? "" : " black"}.svg`} alt="chess piece" />}
                            </span>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}
