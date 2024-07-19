const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("./tft-bd-firebase-adminsdk-vcyvq-39c6398953.json");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.1.76:3000"], // Agrega todas las URLs que necesitas permitir
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let globalToken = "initialToken";

app.post("/token", (req, res) => {
  const token = req.body.token;
  globalToken = token;
});

app.get("/api/subscribe-token", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  const sendToken = () => {
    if (globalToken) {
      res.write(`data: ${JSON.stringify({ token: globalToken })}\n\n`);
    } else {
      console.log("No token available");
      res.write(`data: ${JSON.stringify({ error: "No token available" })}\n\n`);
    }
  };

  sendToken();
  const intervalId = setInterval(sendToken, 10000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
    console.log("Client disconnected from SSE");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, globalToken };
