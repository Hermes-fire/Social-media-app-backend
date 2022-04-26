const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const variables = require("./config/variables");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//db connection
mongoose.connect(variables.MONGO_URI).then(() => console.log("DB Connected"));

const port = variables.port || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
