import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, JOIN_GAME, MOVE } from "./Messages";

export class GameManager {
    games: Game[];
    users: WebSocket[];
    pendingUser: WebSocket | null;

    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }

    handleMessage(message: any, userSocket: WebSocket) {
        if(message.type == JOIN_GAME){
            if (this.pendingUser) {
                console.log("player2 joined, starting game");
                const newGame = new Game(this.pendingUser, userSocket);
                this.games.push(newGame);
                this.pendingUser.send(JSON.stringify({type: INIT_GAME, color: "w"}));
                userSocket.send(JSON.stringify({type: INIT_GAME, color: "b"}));
                this.pendingUser = null;
            } else {
                console.log("player1 joined");
                this.pendingUser = userSocket;
            }
        } else if(message.type == MOVE){
            console.log("someone made a move");
            const curGame = this.games.filter(game => (userSocket === game.player1 || userSocket === game.player2))[0];
            curGame.makeMove(message.move, userSocket);
        }
    }
}