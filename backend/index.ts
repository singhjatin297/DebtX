import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes(io));
app.use("/api/payments", paymentRoutes(io));
app.use("/api/notifications", notificationRoutes());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
