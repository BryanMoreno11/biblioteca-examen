const express = require("express");
const app = express();
const cors = require("cors");
//middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
//rutas
//importamos las rutas del archivo usuarioRoute que serán utilizadas bajo el prefijo api
var libroRoutes = require('./Routes/libroRoutes');
var estudianteRoutes=require('./Routes/estudianteRoutes');
app.use('/api', libroRoutes);
app.use('/api', estudianteRoutes);
//arrancar el servidor
app.listen("3000");
console.log("server up localhost:3000");