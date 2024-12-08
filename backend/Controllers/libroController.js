const pool = require("../database");

// Obtener un libro por código
async function getLibro(req, res) {
    const { id } = req.params; // Recupera el código del libro desde los parámetros de la solicitud
    const query = 'SELECT * FROM libro WHERE codigo=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json(result.rows[0]); // Devuelve el libro encontrado
        } else {
            res.status(404).json({ message: 'No existe el libro con ese código' }); // No encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Obtener todos los libros
async function getLibros(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM libro ORDER BY codigo');
        client.release();
        res.status(200).json(result.rows || []); 
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}


// Crear un libro nuevo
async function createLibro(req, res) {
    const { codigo, categoria, tipo, nombre, editorial, autor, anio_publicacion, stock, imagen } = req.body;
    const query = 'INSERT INTO libro (codigo, categoria, tipo, nombre, editorial, autor, anio_publicacion, stock, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [codigo, categoria, tipo, nombre, editorial, autor, anio_publicacion, stock, imagen];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(201).json({ message: 'Libro guardado exitosamente' }); // Libro creado
        } else {
            res.status(400).json({ message: 'No se pudo guardar el libro' }); // Error en la inserción
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Actualizar un libro
async function updateLibro(req, res) {
    const { id } = req.params; // Recupera el código del libro desde los parámetros de la solicitud
    const { categoria, tipo, nombre, editorial, autor, anio_publicacion, stock, imagen } = req.body;
    const query = 'UPDATE libro SET categoria=$2, tipo=$3, nombre=$4, editorial=$5, autor=$6, anio_publicacion=$7, stock=$8, imagen=$9 WHERE codigo=$1';
    const values = [id, categoria, tipo, nombre, editorial, autor, anio_publicacion, stock, imagen];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Libro actualizado correctamente' }); // Libro actualizado
        } else {
            res.status(400).json({ message: 'No se pudo actualizar el libro' }); // Error en la actualización
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}

// Eliminar un libro por código
async function deleteLibro(req, res) {
    const { id } = req.params; // Recupera el código del libro desde los parámetros de la solicitud
    const query = 'DELETE FROM libro WHERE codigo=$1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Libro eliminado correctamente' }); // Libro eliminado
        } else {
            res.status(404).json({ message: 'No existe el libro con ese código' }); // Libro no encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}


async function updateStockLibro(req, res) {
    const { id } = req.params; // Recupera el código del libro desde los parámetros de la solicitud
    const { stock } = req.body; // Recupera el stock desde el cuerpo de la solicitud

    // Verificar que se haya proporcionado el stock
    if (stock === undefined) {
        return res.status(400).json({ message: 'El campo stock es obligatorio' });
    }

    const query = 'UPDATE libro SET stock=$2 WHERE codigo=$1';
    const values = [id, stock];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Stock actualizado correctamente' }); // Stock actualizado
        } else {
            res.status(404).json({ message: 'No existe el libro con ese código' }); // Libro no encontrado
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" }); // Error de conexión o de ejecución
    }
}


module.exports = { getLibro, getLibros, createLibro, updateLibro, deleteLibro, updateStockLibro};
