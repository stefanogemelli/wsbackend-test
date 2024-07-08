import express from "express";
import { config } from "dotenv";

const { FRONTEND_URL } = config().parsed;

import { createServer } from "http";
import { Server } from "socket.io";

const server = express();

server.get("/", (req, res) => {
  res.send("Hello World!");
});

const httpServer = createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: "https://wsfrontend-test.vercel.app",
    // origin: FRONTEND_URL,
    credentials: true,
  },
});
// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request, next);
// });

// io.on("connection", onConnection(io));

io.on("connection", (socket) => {
  console.log("connection socketId", socket.id);
  socket.emit("hello", "world");

  socket.on("message:new", (arg) => {
    console.log("message", arg);
    socket.broadcast.emit("message:sv", { id: arg.id, data: arg.data + " from server" });
  });
});

httpServer.listen("3001", () => {
  console.log(`Server listening on PORT 3001`);
});
