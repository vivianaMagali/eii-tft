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
    "https://main--flourishing-crostata-43d226.netlify.app/",
    "https://f513-90-165-59-29.ngrok-free.app",
  ], // Agrega todas las URLs que necesitas permitir
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let globalToken = "initialToken";

app.post("/api/token", (req, res) => {
  const token = req.body.token;
  globalToken = token;
  console.log("Token actualizado:", globalToken);
  res.status(200).send("Token recibido y almacenado.");
});

// app.get("/api/subscribe-token", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://localhost:3000",
//     "https://main--flourishing-crostata-43d226.netlify.app/",
//   );

//   const sendToken = () => {
//     if (globalToken) {
//       res.write(`data: ${JSON.stringify({ token: globalToken })}\n\n`);
//     } else {
//       console.log("No token available");
//       res.write(`data: ${JSON.stringify({ error: "No token available" })}\n\n`);
//     }
//   };

//   sendToken();
//   const intervalId = setInterval(sendToken, 10000);

//   req.on("close", () => {
//     clearInterval(intervalId);
//     res.end();
//     console.log("Client disconnected from SSE");
//   });
// });

// Endpoint para enviar una notificación
app.post("/send-notification", async (req, res) => {
  const { title, body } = req.body;

  if (!globalToken || globalToken === "initialToken") {
    return res.status(400).send("Token no disponible.");
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: globalToken, // Usa el token almacenado
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notificación enviada:", response);
    res.status(200).send("Notificación enviada con éxito");
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    res.status(500).send("Error al enviar notificación");
  }
});

// app.post("/send-notification", async (req, res) => {
//   const message = {
//     notification: {
//       title: req.body.title,
//       body: req.body.body,
//     },
//     token: globalToken, // El token del dispositivo a notificar
//   };

//   try {
//     await admin.messaging().send(message);
//     res.status(200).send("Notification sent successfully");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).send("Error sending notification");
//   }
// });

app.get("/api/subscribe-token", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:3000",
    "https://main--flourishing-crostata-43d226.netlify.app/",
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
