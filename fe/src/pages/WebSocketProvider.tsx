import { useWebSocket } from "../hooks/useWebSocket";

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useWebSocket();

  return <>{children}</>;
};
