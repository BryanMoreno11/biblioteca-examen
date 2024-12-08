import { InsertarPrestamos } from "../../src/Controladores/TListaPrestamo";
import { getEstudiantes } from "../Servicios/ServicioEstudiante";
import { getLibros } from "../Servicios/ServicioLibro";
import { validarEdad, validarPrestamoUnico, validarStockLibro } from "../../src/Controladores/TListaPrestamo";
import { ListarPrestamos, cargarPrestamos,RealizarDevolucion  } from "../../src/Controladores/TListaPrestamo";

// region Variables
//variables modal Prestamo
const modal = document.getElementById("modal") as HTMLElement;
const openModalButton = document.getElementById("btn-add") as HTMLElement;
const closeModalButton = document.getElementById("close-modal") as HTMLElement;
const prestamoForm = document.getElementById("prestamo-form") as HTMLFormElement;
const estudianteSelect = document.getElementById("id_estudiante") as HTMLSelectElement;
const tablaLibros = document.getElementById("tabla-libros")!.querySelector("tbody")!;
let librosSeleccionados: number[] = [];
//Variables modal devolución
const modalDevolucion = document.getElementById("modal-devolucion") as HTMLElement;
const closeModalDevolucion = document.getElementById("close-modal-devolucion") as HTMLElement;
const devolucionForm = document.getElementById("devolucion-form") as HTMLFormElement;
let prestamoId: number | null = null;

//region Init
cargarPrestamos().then(() => ListarPrestamos());
llenarcomboEstudiantes();
llenarComboLibros();

//region modal Prestamo
async function llenarcomboEstudiantes() {
    const estudiantes = await getEstudiantes();
    estudianteSelect.innerHTML = estudiantes.map(est =>
        `<option value="${est.id_estudiante}">${est.cedula} (${est.nombre} ${est.apellido})</option>`
    ).join("");
}

async function llenarComboLibros() {
    const libros = await getLibros();
    tablaLibros.innerHTML = libros.map(libro => `
        <tr>
            <td><input type="checkbox" class="checkbox-libro" data-codigo="${libro.codigo}" /></td>
            <td>${libro.nombre}</td>
            <td>${libro.categoria}</td>
            <td>${libro.stock}</td>
        </tr>
    `).join("");
}

tablaLibros.addEventListener("change", async (event) => {
    const checkbox = event.target as HTMLInputElement;
    const codigo = Number(checkbox.getAttribute("data-codigo"));
    const idEstudiante = Number(estudianteSelect.value);

    if (checkbox.checked) {
        if (
            !(await validarStockLibro(codigo)) ||
            !validarPrestamoUnico(idEstudiante, codigo) ||
            !(await validarEdad(idEstudiante, codigo))
        ) {
            checkbox.checked = false;
            return;
        }
        librosSeleccionados.push(codigo);
    } else {
        librosSeleccionados = librosSeleccionados.filter(id => id !== codigo);
    }
});


openModalButton.addEventListener("click", async () => {
    librosSeleccionados = [];
    modal.style.display = "flex";
});

// Cerrar modal
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

    let fechaPrestamo = new Date((<HTMLInputElement>document.getElementById("fecha_prestamo")).value);
    let fechaEntrega = new Date((<HTMLInputElement>document.getElementById("fecha_entrega")).value);
    const idEstudiante = Number(estudianteSelect.value);
    fechaPrestamo.setMinutes(fechaPrestamo.getMinutes() + fechaPrestamo.getTimezoneOffset());
    fechaPrestamo.setHours(0, 0, 0, 0);
    fechaEntrega.setMinutes(fechaEntrega.getMinutes() + fechaEntrega.getTimezoneOffset());
    fechaEntrega.setHours(0, 0, 0, 0);

    if (librosSeleccionados.length === 0) {
        window.alert("Debe seleccionar al menos un libro.");
        return;
    }

    const resultado = await InsertarPrestamos(idEstudiante, librosSeleccionados, fechaPrestamo, fechaEntrega);
    if (resultado) {
        modal.style.display = "none";
        cargarPrestamos().then(() => ListarPrestamos());
        llenarComboLibros();
        llenarcomboEstudiantes();
       
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
    llenarComboLibros();
    llenarcomboEstudiantes();
});
