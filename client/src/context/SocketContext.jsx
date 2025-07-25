import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, userEmail }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userEmail) {
      socket.current = io("http://localhost:5000", {
        query: { userEmail },
      });

      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
        setIsConnected(true);
      });

      socket.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userEmail]);

  return (
    <SocketContext.Provider value={isConnected ? socket.current : null}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
