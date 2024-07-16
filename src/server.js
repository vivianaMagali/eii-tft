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
  methods: ["GET", "POST"], // Métodos permitidos
  allowedHeaders: ["Content-Type"], // Headers permitidos
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let globalToken = "initialToken";

// Ruta para manejar solicitudes POST a /save-token
app.post("/token", (req, res) => {
  const token = req.body.token;
  globalToken = token;
  console.log("Received token:", globalToken);
  // res.send({ message: "Token received successfully", token });
});

app.get("/api/subscribe-token", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  console.log("Client connected to SSE");

  const sendToken = () => {
    if (globalToken) {
      res.write(`data: ${JSON.stringify({ token: globalToken })}\n\n`);
    } else {
      console.log("No token available");
      res.write(`data: ${JSON.stringify({ error: "No token available" })}\n\n`);
    }
  };

  sendToken();
  const intervalId = setInterval(sendToken, 10000); // Enviar token cada 10 segundos

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
    console.log("Client disconnected from SSE");
  });
});
// Ruta para SSE
// app.get("/api/subscribe-token", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.flushHeaders();

//   const sendToken = () => {
//     // res.write(`data: ${JSON.stringify({ token: globalToken })}\n\n`);
//     res.write(
//       `data: ${JSON.stringify({ token: "dAEnPKkkQtCWImtjrGSMsf:APA91bEt7ESwepN5nh-zLejysahtsGNRfEfZJtoW1SXXD59_oY01t8PvnA2O2vQ4oK0KT7ZTph_UVlCpYvmsQdd06GeHGBaIoucEtoKs1iSXLVcSpVqjgWqN_cqEfOyOTAjcq5czE-wh" })}\n\n`,
//     );
//   };
//   sendToken();
//   const intervalId = setInterval(sendToken, 1000);

//   req.on("close", () => {
//     clearInterval(intervalId);
//     res.end();
//   });
// });

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, globalToken };
