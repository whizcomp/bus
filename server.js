const express = require("express");
const mongoose = require("mongoose");
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const bus = require("./routes/buses");
const travel = require("./routes/travels");
const booking = require("./routes/booking");
const cors = require('cors')

app.use(express.json());
app.use(cors())
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/bus", bus);
app.use("/api/travel", travel);
app.use("/api/booking", booking);

mongoose
    .connect("mongodb+srv://cluster0.m54zk.mongodb.net/bus", {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected to mongodb"))
    .catch(() => console.log("failed to connect to mongod"));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));