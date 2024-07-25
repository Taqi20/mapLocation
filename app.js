const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const path = require("path");


app.set("view engine", "ejs");
app.use('/public', express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data })
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
})

app.get('/', (req, res) => {
    res.render('index');
})


const port = 3000;
server.listen(port, () => {
    console.log(`App is up at port ${port}`);
})
