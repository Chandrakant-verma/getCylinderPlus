const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      console.log("JOIN RECEIVED:", data);
      console.log("SOCKET ID:", socket.id);

      const { userId, userType } = data;

      if (userType === "user") {
        const updated = await userModel.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true },
        );

        console.log("USER UPDATED:", updated?.socketId);
      }

      if (userType === "captain") {
        const updated = await captainModel.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true },
        );

        console.log("CAPTAIN UPDATED:", updated?.socketId);
      }
    });

    socket.on("location_update_from_captain_for_server", async (data) => {
      const { userId, locationData } = data;

      if (!locationData || !userId) {
        return socket.emit("error", {
          message: "Invalid location data from captain to server",
        });
      }

      const user = await userModel.findById(userId);

      if (!user?.socketId) return;

      io.to(user.socketId).emit("locaton_update_from_captain_throught_server", {
        userId,
        locationData,
      });
    });

    socket.on("successfully delivered", async (data) => {
      const { userId } = data;

      if (!userId) {
        return socket.emit("error", {
          message: "Invalid userId from captain ka current order",
        });
      }

      const user = await userModel.findById(userId);

      if (!user?.socketId) return;

      io.to(user.socketId).emit("reached", {
        userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("order_made_from_user", async (data) => {
      const { branch } = data;

      if (!branch) {
        return socket.emit("error", {
          message: "invalid branch from user",
        });
      }

      const captain = await captainModel.find({ branch: branch });

      if (!captain) {
        return;
      }

      captain.map(async (cap) => {
        if (cap.socketId) {
          io.to(cap.socketId).emit("order_made", { time: Date.now() });
        }
      });
    });

    socket.on("canceled_from_user", async (data) => {
      const { branch } = data;

      if (!branch) {
        return socket.emit("error", {
          message: "invalid branch from user",
        });
      }

      const captain = await captainModel.find({ branch: branch });

      if (!captain) {
        return;
      }

      captain.map(async (cap) => {
        if (cap.socketId) {
          io.to(cap.socketId).emit("order_made", { time: Date.now() });
        }
      });
    });

    socket.on("otp_verified", async (data) => {
      const { userId } = data;

      const user = await userModel.findById(userId);

      if (!user?.socketId) return;

      io.to(user.socketId).emit("otp_verified");
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  //console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
