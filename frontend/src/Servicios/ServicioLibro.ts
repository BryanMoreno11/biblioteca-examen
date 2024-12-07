import { Libro } from "../Entidades/Libro";
const API_URL = 'http://localhost:3000/api'; 

export async function getLibros(): Promise<Libro[]> {
    try {
        const response = await fetch(`${API_URL}/libros`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        throw error;
    }
}

export async function getLibro(id: string): Promise<Libro> {
    try {
        const response = await fetch(`${API_URL}/libro/${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        throw error;
    }
}

export async function createLibro(libro:Libro): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/libro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libro),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al crear el libro:', error);
        throw error;
    }
}

// Actualizar un libro por código
export async function updateLibro(id: string, libro: Libro): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/libro/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libro),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        throw error;
    }
}

// Eliminar un libro por código
export async function deleteLibro(id: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/libro/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        throw error;
    }
}