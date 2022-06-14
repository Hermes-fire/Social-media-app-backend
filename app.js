const express = require("express");
const { createServer } = require("http");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const variables = require("./config/variables");
const authRoutes = require("./routes/auth");
const announcementRoutes = require("./routes/announcement.routes");
const categoryRoutes = require("./routes/category.routes");
const commentRoutes = require("./routes/comment.routes");
const reactionRoutes = require("./routes/reaction.routes");
const replyRoutes = require("./routes/reply.routes");
const reactionCRoutes = require("./routes/reactionC.routes");
const reactionRRoutes = require("./routes/reactionR.routes");

// Solution 1
// Socket io implementation
const { Server } = require("socket.io");
const httpServer = createServer(app);
// To handle the "cors" and also to reach this server only inside our front app
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//db connection
mongoose.connect(variables.MONGO_URI).then(() => console.log("DB Connected"));
const port = variables.port || 8000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}, waiting db to connect`);
});

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//=== routes ===
// Auth
app.use("/api/auth", authRoutes);
// Announcement
app.use("/api", announcementRoutes);
// Post Category
app.use("/api", categoryRoutes);
// Comments
app.use("/api/comment", commentRoutes);
app.use("/api/comment/reply", replyRoutes);
// Reactions
app.use("/api/reaction", reactionRoutes);
app.use("/api/reactionC", reactionCRoutes); //comment reaction
app.use("/api/reactionR", reactionRRoutes); //reply reaction
//app.use("/api/reactionR", reactionRoutes);

// Socket io functions

let onlineUsers = [];

// Add a new user to onlineUsers array
const  addNewUser = (userId, socketId, fname, lname, profilePicture) => {
  /* !onlineUsers.some((user) => user.userId === userId) && */
    onlineUsers.push({ userId, socketId, fname, lname, profilePicture });
};

// Remove a user from onlineUsers array
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

//  find a userId inside onlineUsers array
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

// Run when a client connects
io.on("connection", (socket) => {
  console.log("someone has connected...");
  console.log("socket id:", socket.id);
   // Add a new user to onlineUsers array
  socket.on("addUser", (user) => {
    console.log("user", user);
    addNewUser(
      user._id,
      socket.id,
      user.fname,
      user.lname,
      user.profilePicture
    );
    console.log("onlineUsers inside : ", onlineUsers);
    // Send onlineUsersList to all users including me
    io.emit("sendOnlineUsersList", {array: onlineUsers});
  });

  
  socket.on("disconnect", () => {
    console.log("socket id:", socket.id);
    // Remove a user from onlineUsers array
    // When closing the browser it will remove the user
    removeUser(socket.id);
    console.log("someone has left!");
    io.emit("sendOnlineUsersList", {array: onlineUsers});
  }); 
});
