import { Prestamo } from "../Entidades/Prestamo"; // Asegúrate de tener la clase Prestamo definida correctamente
const API_URL = 'http://localhost:3000/api'; // Cambia por la URL de tu API si es necesario

// Obtener todos los préstamos
export async function getPrestamos(): Promise<Prestamo[]> {
    try {
        const response = await fetch(`${API_URL}/prestamos`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los préstamos:', error);
        throw error;
    }
}

// Obtener un préstamo por ID
export async function getPrestamo(id: string): Promise<Prestamo> {
    try {
        const response = await fetch(`${API_URL}/prestamo/${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el préstamo:', error);
        throw error;
    }
}

// Crear un nuevo préstamo
export async function createPrestamo(prestamo: Prestamo): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/prestamo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prestamo),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear el préstamo:', error);
        throw error;
    }
}

// Marcar un préstamo como devuelto (actualizar la fecha de devolución)
export async function devolucion(id: string, fecha_devolucion: Date): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/prestamo/devolucion/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_devolucion }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al marcar el préstamo como devuelto:', error);
        throw error;
    }
}

// Eliminar un préstamo por ID
export async function deletePrestamo(id: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/prestamo/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el préstamo:', error);
        throw error;
    }
}
