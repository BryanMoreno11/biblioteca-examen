const { Router } = require('express');
const router = new Router();
//Extraemos las funciones del controller
var { getLibro, getLibros, createLibro, updateLibro, deleteLibro } = require('../Controllers/libroController');
//definimos las rutas de los endpoints y que función realizará
//->Rutas para la tabla franquicia
router.get('/libros', getLibros);
router.get('/libro/:id', getLibro);
router.post('/libro', createLibro);
router.put('/libro/:id', updateLibro)
router.delete('/libro/:id', deleteLibro);
//exportación
module.exports = router;