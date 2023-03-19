const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// block routers //

const blockrouter = require("./routes/block");

// block routers //

// mongod db logic//

// mongo db logic//

// app //

const app = express();

// app //

//socket logic

const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(
  server,
  {
    cors: {
      origin: ["http://localhost:3000"],
    },
  },
  {
    maxHttpBufferSize: 1e10, // 10000 MB
  }
);

let users = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // to get who are typing for message

  socket.on("typing", (data) => io.emit("typingResponse", data));

  // to get block status

  socket.on("blockstatus", (data) => io.emit("blockstatusresponse", data));

  const realtimeUpdate = db.collection("users").watch();

  realtimeUpdate.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        const newUser = {
          _id: change.fullDocument._id,
          name: change.fullDocument.name,
          email: change.fullDocument.email,
          imgUrl: change.fullDocument.imgUrl,
          activeStatus: true,
          socketID: socket.id,
        };

        io.emit("newregister", newUser);

        break;

      case "delete":
        io.emit("deleteMessage", change.documentKey._id);
        break;
    }
  });

  // listen when file is uploaded successfully
  socket.on("uploaded", (arg) => {
    io.emit("download", "download file");
  });

  socket.on("message", (data) => {
    io.emit("messageresponse", data);

    console.log("message data", data);
  });

  //Listens when a new user joins the server

  socket.on("newuser", (data) => {
    //Adds the new user to the list of users

    users.push(data);

    console.log("active users from users array =>", users);

    db.collection("users").updateOne(
      { email: data.email },
      { $set: { activeStatus: true, socketID: socket.id } },
      (errorcallback, resposnecallback) => {
        if (errorcallback) throw errorcallback;
        console.log(
          "User" + data.email + "is connected with socketid" + socket.id
        );
        // server callback
        db.collection("users")
          .findOne({ email: data.email })
          .then((user) => {
            io.emit("serversuccesscallbacktocurrentuser", user);
          })
          .catch((error) => {
            io.emit("servererrorcallbacktocurrentuser", error);
          });
      }
    );

    const uniqueusers = users.filter(
      (user, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.email === user.email &&
            t._id === user._id &&
            t.name === user.name &&
            t.imgUrl === user.imgUrl &&
            t.socketID === user.socketID
        )
    );

    console.log("unique array =>", uniqueusers);

    //Sends the list of users to the client
    io.emit("newuserresponse", uniqueusers);
  });

  // when a user is disconnected this socket function will be called

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected", socket.id);
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);

    db.collection("users")
      .findOne({ socketID: socket.id })
      .then((user) => {
        try {
          db.collection("users").updateOne(
            { email: user.email },
            { $set: { socketID: "", activeStatus: false } },
            (error, success) => {
              if (error) throw error;
              console.log("disconnection succeeded");
              io.emit("chatuserstate", user);
            }
          );
        } catch (error) {
          console.log("No user");
        }
      });
    console.log(users);
    //Sends the list of users to the client
    io.emit("newuserresponse", users);
    socket.disconnect();
  });
});

// sockent logic

const dotenv = require("dotenv");
dotenv.config();

const AuthRoute = require("./routes/auth");

const LoggedRoute = require("./routes/loggedUser");
const otherusersRoute = require("./routes/otherUser");

mongoose.connect("mongodb://localhost:27017/migodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// here migodb is database name

mongoose.set("strictQuery", true);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("Database connection is established");
  db.collection("users")
    .updateMany({}, { $set: { activeStatus: false, socketID: "" } })
    .then((response) => {
      console.log("successfully database all chunk clean up");
    })
    .catch((error) => {
      console.log("error=>", error);
    });

  // new user is registered auto callback response

  const realtimeUpdate = db.collection("messages").watch();

  realtimeUpdate.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        const message = {
          _id: change.fullDocument._id,
          text: change.fullDocument.text,
        };

        io.of("/api/socket").emit("newMessage", message);

        break;

      case "delete":
        io.of("/api/socket").emit("deleteMessage", change.documentKey._id);
        break;
    }
  });
});

app.use(cors());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

app.use("/api", AuthRoute);

app.use("/api", LoggedRoute);

app.use("/api", otherusersRoute);

app.use("/api", blockrouter);

// file transfer //
// to see the file as public access

app.use("/static", express.static("uploads"));

const filesrouter = require("./routes/files");

app.use("/api", filesrouter);
