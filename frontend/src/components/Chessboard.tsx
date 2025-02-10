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
    } | null)[][], setBoard: any, chess: Chess, socket: WebSocket | null
}) => {
    console.log("board: ", board);
    const [from, setFrom] = useState<Square>();

    const handleCellClick = (piece: Piece, curCellLocation: Square) => {
        console.log("cell clicked: ", piece);
        console.log("or: ", curCellLocation);

        if(piece && piece.color == chess.turn()) {
            setFrom(curCellLocation);
        } else if(from) {
            const isPromotingResult = isPromoting(chess, from, curCellLocation)
            console.log("isPromotingResult", isPromotingResult);
            const curMove: Move = {
                from: from,
                to: curCellLocation,
                promotion: isPromotingResult ? QUEEN : undefined
            };
            setFrom(undefined);

            try {
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

            if(chess.isGameOver()){
                console.log("game over made by player");
                alert("Game Over!!");
            }
        }
    }

    return (
        <div className="flex flex-col">
            {board.reverse().map((row, i) => {
                return <div key={i} className="w-160 flex">
                    {row.map((piece, j) => {
                        const curCellLocation = String.fromCharCode(97 + (j%8)) + String(8 - (i)) as Square;
                        return <div key={j} 
                                onClick={() => {handleCellClick(piece, curCellLocation)}}
                                className={`w-20 h-20 flex justify-center items-center 
                                ${(i+j)%2==0?"bg-sky-300":"bg-sky-600"}
                                ${from == curCellLocation ? "border-2 border-white" : ""}`}>
                            <span>
                                {/* {cell?.type} */}
                                {piece && <img src={`${piece?.type}${piece?.color == 'w' ? "" : " black"}.svg`} alt="chess piece" />}
                            </span>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}
