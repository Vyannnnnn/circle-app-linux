import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";

let wss: WebSocketServer;

export const initWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
      // Echo the message back to the client
      // ws.send(`Echo: ${message}`);
    });
    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });
};

export const broadcast = (event: string, data: unknown) => {
  if (!wss) {
    console.error("WebSocket server not initialized");
    return;
  }
  const message = JSON.stringify({ event, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
