const pool = require("../database");

// Obtener un estudiante por ID
async function getEstudiante(req, res) {
    const { id } = req.params; // Recupera el ID del estudiante desde los parámetros de la solicitud
    const query = 'SELECT * FROM estudiante WHERE id_estudiante=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json(result.rows[0]); // Devuelve el estudiante encontrado
        } else {
            res.status(404).json({ message: 'No existe el estudiante con ese ID' }); // No encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Obtener todos los estudiantes
async function getEstudiantes(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM estudiante ORDER BY id_estudiante');
        client.release();
        res.status(200).json(result.rows || []); 
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Crear un estudiante nuevo
async function createEstudiante(req, res) {
    const { cedula, nombre, apellido, sexo, fecha_naci, fecha_fin_sancion } = req.body;
    const query = 'INSERT INTO estudiante (cedula, nombre, apellido, sexo, fecha_naci, fecha_fin_sancion) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [cedula, nombre, apellido, sexo, fecha_naci, fecha_fin_sancion];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(201).json({ message: 'Estudiante guardado exitosamente' }); // Estudiante creado
        } else {
            res.status(400).json({ message: 'No se pudo guardar el estudiante' }); // Error en la inserción
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Actualizar un estudiante
async function updateEstudiante(req, res) {
    const { id } = req.params; // Recupera el ID del estudiante desde los parámetros de la solicitud
    const { cedula, nombre, apellido, sexo, fecha_naci, fecha_fin_sancion } = req.body;
    const query = 'UPDATE estudiante SET cedula=$2, nombre=$3, apellido=$4, sexo=$5, fecha_naci=$6, fecha_fin_sancion=$7 WHERE id_estudiante=$1';
    const values = [id, cedula, nombre, apellido, sexo, fecha_naci, fecha_fin_sancion];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Estudiante actualizado correctamente' }); // Estudiante actualizado
        } else {
            res.status(400).json({ message: 'No se pudo actualizar el estudiante' }); // Error en la actualización
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Eliminar un estudiante por ID
async function deleteEstudiante(req, res) {
    const { id } = req.params; // Recupera el ID del estudiante desde los parámetros de la solicitud
    const query = 'DELETE FROM estudiante WHERE id_estudiante=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Estudiante eliminado correctamente' }); // Estudiante eliminado
        } else {
            res.status(404).json({ message: 'No existe el estudiante con ese ID' }); // Estudiante no encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

module.exports = { getEstudiante, getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante };
