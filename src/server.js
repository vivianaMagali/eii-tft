const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("../tft-bd-firebase-adminsdk-vcyvq-39c6398953.json");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.1.76:3000",
    "https://main--flourishing-crostata-43d226.netlify.app",
    "https://ef9c-90-165-59-29.ngrok-free.app",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let globalToken = "initialToken";

// Endpoint para obtener del cliente el token y lo guardo en la variable globalToken
app.post("/api/token", (req, res) => {
  const token = req.body.token;
  globalToken = token;
  console.log("Token actualizado:", globalToken);
  res.status(200).send("Token recibido y almacenado.");
});

// Endpoint para enviar una notificación
// app.post("/send-notification", async (req, res) => {
//   const { title, body } = req.body;

//   if (!globalToken || globalToken === "initialToken") {
//     return res.status(400).send("Token no disponible.");
//   }

//   const message = {
//     notification: {
//       title: title,
//       body: body,
//     },
//     token: globalToken,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Notificación enviada:", response);
//     res.status(200).send("Notificación enviada con éxito");
//   } catch (error) {
//     console.error("Error al enviar notificación:", error);
//     res.status(500).send("Error al enviar notificación");
//   }
// });

// Endpoint para enviar el token al que esta subscrito en el cliente
app.get("/api/subscribe-token", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://ef9c-90-165-59-29.ngrok-free.app",
  );

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
