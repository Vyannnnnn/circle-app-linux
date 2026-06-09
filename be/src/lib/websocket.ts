import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";

let wss: WebSocketServer;
const clients = new Map<number, WebSocket>();

export const initWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "register" && parsedMessage.userId) {
          clients.set(parsedMessage.userId, ws);
          console.log(`Registered client with user ID: ${parsedMessage.userId}`);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    ws.on("close", () => {
      for (const [userId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(userId);
          console.log(`Client with user ID ${userId} disconnected`);
          break;
        }
      }
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

export const sendToUser = (userId: number, event: string, data: unknown) => {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ event, data }));
  }
};

