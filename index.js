const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use('/storage', express.static('storage/'))
const { Server } = require('socket.io')
const { createServer } = require('http')
const db = require('./models');
// route Application
const UserRoute = require('./routes/Users');
const AuthRoute = require('./routes/Auth');
const MentorRoute = require('./routes/Mentor');
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" } });
app.use('/users', UserRoute);
app.use('/auth', AuthRoute);
app.use('/mentor', MentorRoute);


io.engine.use(session({
    secret: "mamanrecing",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
        socket.broadcast.emit('message_received', data);
    });
    socket.on("disconnected", () => {
        console.log(`socket disconnected`);
    })
});
db.sequelize.sync().then(() => {
    httpServer.listen(3001);
});