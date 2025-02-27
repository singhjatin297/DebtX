import io from "socket.io-client";
import { Notification } from "@/types/notification";

const socket = io("http://localhost:4000", {
  autoConnect: true,
  transports: ["websocket"],
  auth: { withCredentials: true },
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("notification", (data: Notification) => {
  console.log("Notification received:", data);
});

socket.on("payment_update", (data: { customerId: string; status: string }) => {
  console.log("Payment update:", data);
});

export default socket;
