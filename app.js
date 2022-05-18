const express = require("express");
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
const commentRoutes = require("./routes/comment.routes")
const reactionRoutes = require("./routes/reaction.routes")
const replyRoutes = require("./routes/reply.routes")

//db connection
mongoose.connect(variables.MONGO_URI).then(() => console.log("DB Connected"));
const port = variables.port || 8000;
app.listen(port, () => {
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