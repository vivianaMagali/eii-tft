const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware para permitir solicitudes CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);

// // Ruta para obtener la imagen como blob
// app.get("/api/getImageBlob", (req, res) => {
//   // Suponiendo que tienes la imagen en un buffer
//   const fs = require("fs");
//   const imagePath = "ruta/a/tu/imagen.jpg"; // Cambia esta ruta por la ruta de tu imagen

//   fs.readFile(imagePath, (err, data) => {
//     if (err) {
//       res.status(500).send("Error al leer la imagen");
//       return;
//     }
//     res.type("image/jpeg"); // Cambia el tipo MIME según el tipo de imagen que tengas
//     res.send(data);
//   });
// });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
