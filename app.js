const express = require('express');
const app = express();
require('dotenv').config()
const mongoose = require('mongoose');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

//db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))

const port = process.env.PORT || 8000

app.listen(port, ()=>{console.log(`Server is running on port ${port}`)})

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);



