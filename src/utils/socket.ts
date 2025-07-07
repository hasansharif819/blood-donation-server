import { Server } from "socket.io";
import prisma from "../shared/prisma";
import { messageService } from "../app/modules/message/message.service";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("joinRoom", ({ conversationId }) => {
      socket.join(conversationId);
      console.log(`📥 Joined room: ${conversationId}`);
    });

    // 📩 Fetch messages with pagination
    socket.on(
      "getMessages",
      async ({ conversationId, page = 1, limit = 30 }) => {
        try {
          const result =
            await messageService.getMessagesByConversationIdUsingSocket(
              conversationId,
              page,
              limit
            );

          // ✅ THIS SHOULD BE AN ARRAY!
          // Make sure result.data is an array of messages
          socket.emit("messagesFetched", {
            data: result.data, // <-- This should be an array
            meta: result.meta,
          });
        } catch (error) {
          console.error("❌ Failed to fetch messages:", error);
          socket.emit("error", "Failed to fetch messages");
        }
      }
    );

    // 📨 Send a message
    socket.on("sendMessage", async (data) => {
      try {
        const { conversationId, senderId, content, messageType } = data;
        console.log("📥 Incoming message:", data); // <-- ADD THIS LINE

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
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        });

        io.to(conversationId).emit("receiveMessage", saved);
      } catch (err) {
        console.error("❌ Failed to send message:", err); // Shows the real issue
        socket.emit("error", "Failed to send message");
      }
    });

    // 📞 Call events
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
      console.log("🚫 User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
