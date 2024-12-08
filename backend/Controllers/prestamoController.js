const pool = require("../database");

// Obtener un préstamo por id
async function getPrestamo(req, res) {
    const { id } = req.params; // Recupera el ID del préstamo desde los parámetros de la solicitud
    const query = 'SELECT * FROM vista_prestamo WHERE id_prestamo=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json(result.rows[0]); // Devuelve el préstamo encontrado
        } else {
            res.status(404).json({ message: 'No existe el préstamo con ese ID' }); // No encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Obtener todos los préstamos
async function getPrestamos(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM vista_prestamo ORDER BY id_prestamo');
        client.release();
        res.status(200).json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Crear un préstamo nuevo
async function createPrestamo(req, res) {
    const { id_estudiante, codigo, fecha_prestamo, fecha_entrega } = req.body;
    const query = 'INSERT INTO prestamo (id_estudiante, codigo, fecha_prestamo, fecha_entrega, fecha_devolucion, estado) VALUES ($1, $2, $3, $4, NULL, \'Prestado\')';
    const values = [id_estudiante, codigo, fecha_prestamo, fecha_entrega];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(201).json({ message: 'Préstamo registrado exitosamente' }); // Préstamo creado
        } else {
            res.status(400).json({ message: 'No se pudo registrar el préstamo' }); // Error en la inserción
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Actualizar un préstamo (marcar como devuelto con fecha de devolución)
async function devolucion(req, res) {
    const { id } = req.params; // Recupera el ID del préstamo desde los parámetros de la solicitud
    const { fecha_devolucion } = req.body; // Recupera la fecha de devolución desde el cuerpo de la solicitud

    // Verifica que se haya proporcionado una fecha de devolución
    if (!fecha_devolucion) {
        return res.status(400).json({ message: 'La fecha de devolución es obligatoria' });
    }

    const query = 'UPDATE prestamo SET fecha_devolucion=$2, estado=\'Devuelto\' WHERE id_prestamo=$1';
    const values = [id, fecha_devolucion];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Préstamo marcado como devuelto' }); // Préstamo actualizado
        } else {
            res.status(404).json({ message: 'No existe el préstamo con ese ID' }); // Préstamo no encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Eliminar un préstamo por ID
async function deletePrestamo(req, res) {
    const { id } = req.params; // Recupera el ID del préstamo desde los parámetros de la solicitud
    const query = 'DELETE FROM prestamo WHERE id_prestamo=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Préstamo eliminado correctamente' }); // Préstamo eliminado
        } else {
            res.status(404).json({ message: 'No existe el préstamo con ese ID' }); // Préstamo no encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

module.exports = { getPrestamo, getPrestamos, createPrestamo, devolucion, deletePrestamo };
