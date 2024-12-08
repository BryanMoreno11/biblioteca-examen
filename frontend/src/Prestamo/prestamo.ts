import { InsertarPrestamo } from "../../src/Controladores/TListaPrestamo";
import { getEstudiantes } from "../Servicios/ServicioEstudiante";
import { getLibros } from "../Servicios/ServicioLibro";
import {ListarPrestamos, cargarPrestamos, RealizarDevolucion } from "../../src/Controladores/TListaPrestamo";

// Variables
const modal = document.getElementById("modal") as HTMLElement;
const openModalButton = document.getElementById("btn-add") as HTMLElement;
const closeModalButton = document.getElementById("close-modal") as HTMLElement;
const prestamoForm = document.getElementById("prestamo-form") as HTMLFormElement;
const estudianteSelect = document.getElementById("id_estudiante") as HTMLSelectElement;
const libroSelect = document.getElementById("codigo") as HTMLSelectElement;
const modalDevolucion = document.getElementById("modal-devolucion") as HTMLElement;
const closeModalDevolucion = document.getElementById("close-modal-devolucion") as HTMLElement;
const devolucionForm = document.getElementById("devolucion-form") as HTMLFormElement;
let prestamoId: number | null = null;
//region init
cargarPrestamos().then(()=>ListarPrestamos());
//region Modal Prestamo
async function llenarCombos() {
    const estudiantes = await getEstudiantes();
    estudianteSelect.innerHTML = estudiantes.map(est => 
        `<option value="${est.id_estudiante}">${est.cedula} (${est.nombre} ${est.apellido})</option>`
    ).join("");

    const libros = await getLibros();
    libroSelect.innerHTML = libros.map(libro => 
        `<option value="${libro.codigo}">${libro.nombre}</option>`
    ).join("");
}


openModalButton.addEventListener("click", async () => {
    await llenarCombos(); 
    modal.style.display = "flex";
});


closeModalButton.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

prestamoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const resultado = await InsertarPrestamo();
    if (resultado) {
        alert("Préstamo registrado exitosamente");
        modal.style.display = "none";
        cargarPrestamos().then(()=>ListarPrestamos());
    }
});

//region modal devolucion
document.addEventListener("click", (event) => {
    const target = event.target as HTMLButtonElement;
    const parent = target.parentNode?.parentNode;

    if (target.classList.contains("devolucion") && parent) {
        console.log("click en devolución");
        const fila = parent as HTMLTableRowElement;
        prestamoId = Number(fila.children[0].innerHTML); // ID del préstamo en la primera columna
        let prestamoEstado = fila.children[6].innerHTML;
        if (prestamoEstado === "Devuelto") {
            window.alert("Este préstamo ya ha sido devuelto");
            return;
        }
        modalDevolucion.style.display = "flex";
    }
});

closeModalDevolucion.addEventListener("click", (event) => {
    event.preventDefault();
    modalDevolucion.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modalDevolucion) {
        modalDevolucion.style.display = "none";
    }
});

devolucionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (prestamoId === null) {
        window.alert("No se pudo identificar el préstamo");
        return;
    }
    await RealizarDevolucion(prestamoId);
    modalDevolucion.style.display = "none";
    prestamoId = null;
    cargarPrestamos().then(()=>ListarPrestamos());
});
