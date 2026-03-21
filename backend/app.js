const express = require("express");
const cors = require("cors");

const generoRoutes = require("./src/routes/generoRoutes");
const directorRoutes = require("./src/routes/directorRoutes");
const productoraRoutes = require("./src/routes/productoraRoutes");
const tipoRoutes = require("./src/routes/tipoRoutes");
const mediaRoutes = require("./src/routes/mediaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/generos", generoRoutes);
app.use("/directores", directorRoutes);
app.use("/productoras", productoraRoutes);
app.use("/tipos", tipoRoutes);
app.use("/media", mediaRoutes);

app.listen(3000, ()=>{
    console.log("Servidor corriendo en puerto 3000");
});