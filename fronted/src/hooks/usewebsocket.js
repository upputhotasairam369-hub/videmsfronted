import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    if (!url) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => setReadyState(true);
    ws.current.onclose = () => setReadyState(false);
    ws.current.onmessage = (event) => setLastMessage(JSON.parse(event.data));

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [url]);

  const send = useCallback((data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { lastMessage, readyState, send };
};
