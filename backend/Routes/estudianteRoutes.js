const { Router } = require('express');
const router = new Router();
// Extraemos las funciones del controller
const { getEstudiante, getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } = require('../Controllers/estudianteController');

// Definimos las rutas de los endpoints y qué función realizará
router.get('/estudiantes', getEstudiantes); // Obtener todos los estudiantes
router.get('/estudiante/:id', getEstudiante); // Obtener un estudiante por ID
router.post('/estudiante', createEstudiante); // Crear un nuevo estudiante
router.put('/estudiante/:id', updateEstudiante); // Actualizar un estudiante
router.delete('/estudiante/:id', deleteEstudiante); // Eliminar un estudiante por ID

// Exportación del router
module.exports = router;
