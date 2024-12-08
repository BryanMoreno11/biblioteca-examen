const { Router } = require('express');
const router = new Router();

// Extraemos las funciones del controller
var { getPrestamo, getPrestamos, createPrestamo, devolucion, deletePrestamo } = require('../Controllers/prestamoController');

// Definimos las rutas de los endpoints y qué función realizará
// Rutas para la tabla de préstamos
router.get('/prestamos', getPrestamos);               // Obtener todos los préstamos
router.get('/prestamo/:id', getPrestamo);             // Obtener un préstamo por ID
router.post('/prestamo', createPrestamo);             // Crear un préstamo nuevo
router.put('/prestamo/devolucion/:id', devolucion);   // Marcar préstamo como devuelto
router.delete('/prestamo/:id', deletePrestamo);       // Eliminar un préstamo por ID

// Exportación de las rutas
module.exports = router;
