import { useEffect, useState } from "react"

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = (event) => {
            console.log("ws onOpen, event: ", event);
            setSocket(ws);
        }
        ws.onclose = (event) => {
            console.log("ws onClose, event: ", event);
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [])
    
    return socket;
}