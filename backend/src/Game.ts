import { WebSocket } from "ws"
import {BLACK, Chess, WHITE} from 'chess.js'
import { GAME_OVER, MOVE } from "./Messages";

interface move {
    from: string,
    to: string
}

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private moves: move[];
    private chess: Chess;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = [];
        this.chess = new Chess();
    }

    makeMove(move: move, playerSocket: WebSocket) {
        // add validation to check if player who send the move has the turn 
        const turn = this.chess.turn();
        if((turn == WHITE && playerSocket === this.player2) 
            || (turn == BLACK && playerSocket === this.player1)){
            console.log("it's not your move");
            return;
        }
        
        const moveData = {
            type: MOVE,
            move: move
        }
        if(turn == WHITE){
            console.log("move by player1")
            this.player2.send(JSON.stringify(moveData));
        } else {
            console.log("move by player2")
            this.player1.send(JSON.stringify(moveData));
        }
        this.chess.move(move);
        console.log("board: ", this.chess.pgn());
        this.moves.push(move);

        if(this.chess.isGameOver()){
            console.log(`game over, winner is ${turn}`);
            const gameOverMessage = {
                type: GAME_OVER,
                winner: this.chess.isDraw() ? "draw" : turn
            }
            this.player1.send(JSON.stringify(gameOverMessage));
            this.player2.send(JSON.stringify(gameOverMessage));
        }
    }
}