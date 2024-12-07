import { Estudiante } from "../Entidades/Estudiante";
const API_URL = 'http://localhost:3000/api';

// Obtener todos los estudiantes
export async function getEstudiantes(): Promise<Estudiante[]> {
    try {
        const response = await fetch(`${API_URL}/estudiantes`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        throw error;
    }
}

// Obtener un estudiante por ID
export async function getEstudiante(id: string): Promise<Estudiante> {
    try {
        const response = await fetch(`${API_URL}/estudiante/${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el estudiante:', error);
        throw error;
    }
}

// Crear un nuevo estudiante
export async function createEstudiante(estudiante: Estudiante): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/estudiante`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estudiante),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear el estudiante:', error);
        throw error;
    }
}

// Actualizar un estudiante por ID
export async function updateEstudiante(id: string, estudiante: Estudiante): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/estudiante/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estudiante),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        throw error;
    }
}

// Eliminar un estudiante por ID
export async function deleteEstudiante(id: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/estudiante/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        throw error;
    }
}
