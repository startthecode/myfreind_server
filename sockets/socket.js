import "dotenv/config";
import { Server } from "socket.io";

export function initSocket(server) {
  const io = new Server({
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.listen(process.env.SOCKET_PORT, () => {});

  let activeUsers = [];
  let chattingPair = [];

  io.on("connection", (socket) => {
    socket.on("new_user_add", (user) => {
      if (!activeUsers.find((val) => val.user.userID === user.userID)) {
        activeUsers.push({
          user: user,
          socketID: socket.id,
        });
      }
    });

    socket.on("send_friendRequest", (data) => {
      let requestReceiver = activeUsers.find(
        (val) => val.user.userID === data.receiverID
      );
      let requestSender = activeUsers.find(
        (val) => val.user.userID === data.senderID
      );
      if (requestReceiver) {
        io.to(requestReceiver.socketID).emit(
          "recieve_friendRequest",
          requestSender.user
        );
      }
    });

    socket.emit(
      "active_friends",
      activeUsers.map((val) => val.user)
    );

    socket.on("getAcitveUser", (data) => {
      socket.emit(
        "acitveUsers",
        activeUsers.map((val) => val.user)
      );
    });

    //message Section
    socket.on("newMessage", (data) => {
      let messageReceiver = activeUsers.find(
        (val) => val.user.userID === +data.receiverID
      );
      let messageSender = activeUsers.find(
        (val) => val.user.userID === +data.senderID
      );

      if (messageReceiver) {
        io.to(messageReceiver.socketID).emit("recieve_message", {
          user: messageSender.user,
          messageData: data.messageData,
        });
      }
    });

    socket.on("chattingWith", (data) => {
      let messageReceiver = activeUsers.find(
        (val) => val.user.userID === +data.receiverID
      );
      let messageSender = activeUsers.find(
        (val) => val.user.userID === +data.senderID
      );

      if (messageReceiver) {
        if (
          !chattingPair.find(
            (val) =>
              val.senderID === +data.senderID &&
              val.receiverID === +data.receiverID
          )
        ) {
          chattingPair.push(data);
        }
        let isChattingWithEachOther = chattingPair.find(
          (val) =>
            val.senderID === +data.receiverID &&
            val.receiverID === +data.senderID
        );
        io.to(messageSender?.socketID).emit(
          "isChattingWithMe",
          isChattingWithEachOther
        );

        if (isChattingWithEachOther) {
          io.to(messageReceiver?.socketID).emit(
            "isChattingWithMe",
            isChattingWithEachOther
          );
        }
      }
    });

    socket.on("noChatting", (data) => {
      let messageReceiver = activeUsers.find(
        (val) => val.user.userID === +data.receiverID
      );
      let isChattingWithEachOther = chattingPair.find(
        (val) =>
          val.senderID === +data.receiverID && val.receiverID === +data.senderID
      );
      chattingPair = chattingPair.filter(
        (val) => val.senderID !== +data.senderID
      );
      isChattingWithEachOther &&
        io.to(messageReceiver?.socketID).emit("isChattingWithMe", false);
    });

    socket.on("updateSeenStatus", (data) => {
      let seenReceiver = activeUsers.find(
        (val) => val.user.userID === +data.receiverID
      );

      let seenSender = activeUsers.find(
        (val) => val.user.userID === +data.senderID
      );

      seenReceiver &&
        io.to(seenReceiver?.socketID).emit("getSeenStatus", {
          seenSender: seenSender.user.userID,
          seen: true,
        });
    });

    socket.on("isTyping", (data) => {
      let typingReceiver = activeUsers.find(
        (val) => val.user.userID === +data.receiverID
      );

      let typingSender = activeUsers.find(
        (val) => val.user.userID === +data.senderID
      );

      let isChattingWithEachOther = chattingPair.find(
        (val) =>
          val.senderID === +data.receiverID && val.receiverID === +data.senderID
      );

      typingReceiver &&
        isChattingWithEachOther &&
        io
          .to(typingReceiver?.socketID)
          .emit("getTypingStatus", { typingStatus: data.istyping });
    });

    socket.on("disconnect", (data) => {
      activeUsers = activeUsers.filter((val) => val.socketID !== socket.id);
    });
  });
}
