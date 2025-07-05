// import { Server } from "socket.io";
// import prisma from "../shared/prisma";

// let io: Server;

// export const initSocket = (server: any) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*", // update with frontend URL
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("joinRoom", ({ conversationId }) => {
//       socket.join(conversationId);
//     });

//     socket.on("sendMessage", async (data) => {
//       // Save to DB (Message)
//       const saved = await prisma.message.create({
//         data: {
//           conversationId: data.conversationId,
//           senderId: data.senderId,
//           content: data.content,
//           type: data.messageType || "TEXT",
//         },
//       });

//       io.to(data.conversationId).emit("receiveMessage", saved);
//     });

//     socket.on("startCall", ({ conversationId, type }) => {
//       io.to(conversationId).emit("callIncoming", {
//         from: socket.id,
//         type,
//       });
//     });

//     socket.on("endCall", ({ conversationId }) => {
//       io.to(conversationId).emit("callEnded");
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };

// export const getIO = () => io;

import { Server } from "socket.io";
import prisma from "../shared/prisma";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const payload = data?.data || data;

        const { conversationId, senderId, content, messageType } = payload;

        if (!conversationId || !senderId || !content) {
          console.error("❌ Invalid message data:", data);
          return socket.emit(
            "error",
            "Missing conversationId, senderId, or content"
          );
        }

        const saved = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            content,
            type: messageType || "TEXT",
          },
        });

        io.to(conversationId).emit("receiveMessage", saved);
      } catch (err) {
        console.error("❌ Failed to send message:", err);
        socket.emit("error", "Failed to send message");
      }
    });

    // socket.on("sendMessage", async (data) => {
    //   try {
    //     const { conversationId, senderId, content, messageType } = data;

    //     // 🔍 Validate required fields
    //     if (!conversationId || !senderId || !content) {
    //       console.error("❌ Invalid message data:", data);
    //       return socket.emit(
    //         "error",
    //         "Missing conversationId, senderId, or content"
    //       );
    //     }

    //     // ✅ Save to DB
    //     const saved = await prisma.message.create({
    //       data: {
    //         conversationId,
    //         senderId,
    //         content,
    //         type: messageType || "TEXT",
    //       },
    //     });

    //     // 📢 Broadcast to room
    //     io.to(conversationId).emit("receiveMessage", saved);
    //   } catch (err) {
    //     console.error("❌ Failed to save message:", err);
    //     socket.emit("error", "Failed to send message");
    //   }
    // });

    socket.on("startCall", ({ conversationId, type }) => {
      io.to(conversationId).emit("callIncoming", {
        from: socket.id,
        type,
      });
    });

    socket.on("endCall", ({ conversationId }) => {
      io.to(conversationId).emit("callEnded");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
