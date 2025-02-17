import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [websocketURL, setWebsocketURL] = useState(null);

    useEffect(() => {
        fetch("https://plated-mantis-450714-v6.el.r.appspot.com/websocketurl").then((res) => {
            return res.json();
        }).then((data) => {
            console.log("data: ", data)
            setWebsocketURL(data.ws_url);
        }).catch((err) => {
            console.error("error fetching websocket url: ", err);
        })
    }, [])

    useEffect(() => {
        console.log("websocketURL: ", websocketURL);
        if(!websocketURL) return;
        const ws = new WebSocket(websocketURL);
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
    }, [websocketURL])
    
    return socket;
}