import { Estudiante, Sexo } from "../Entidades/Estudiante";
import { createEstudiante, deleteEstudiante, getEstudiantes, updateEstudiante } from "../Servicios/ServicioEstudiante";
export { ListaEstudiantes };

let ListaEstudiantes: Estudiante[] = [];

// Función insertar estudiantes
export async function Insertar() {
    let id = 0; // ID se genera automáticamente en la base de datos
    let cedula = (<HTMLInputElement>document.getElementById("cedula")).value;
    let nombre = (<HTMLInputElement>document.getElementById("nombre")).value;
    let apellido = (<HTMLInputElement>document.getElementById("apellido")).value;
    let sexo = (<HTMLInputElement>document.getElementById("sexo")).value as Sexo;
    let fechaNaci = new Date((<HTMLInputElement>document.getElementById("fechaNaci")).value);

    if (!verificarCedulaRepetida(cedula) && validaciones(cedula, nombre, apellido,fechaNaci)) {
        let estudiante = new Estudiante(id, cedula, nombre, apellido, sexo, fechaNaci);
        console.log("El estudiante insertado es ",estudiante);
        await createEstudiante(estudiante);
        return true;
    }
    return false;
}

// Función Editar
export async function Editar(id: number) {
    let cedula = (<HTMLInputElement>document.getElementById("cedula")).value;
    let nombre = (<HTMLInputElement>document.getElementById("nombre")).value;
    let apellido = (<HTMLInputElement>document.getElementById("apellido")).value;
    let sexo = (<HTMLInputElement>document.getElementById("sexo")).value as Sexo;
    let fechaNaci = new Date((<HTMLInputElement>document.getElementById("fechaNaci")).value);

    let index = ListaEstudiantes.findIndex(est => est.id_estudiante === id);
    if (!verificarCedulaRepetida(cedula, index) && validaciones(cedula, nombre, apellido,fechaNaci)) {
        let estudiante = new Estudiante(id, cedula, nombre, apellido, sexo, fechaNaci);
        await updateEstudiante(id.toString(), estudiante);
        return true;
    }
    return false;
}

// Función Eliminar
export async function Eliminar(id: number) {
    await deleteEstudiante(id.toString());
}

// Función Listar estudiantes
export function Listar() {
    let lis = "";
    let lista = <HTMLElement>document.getElementById("lista-estudiantes");
    for (let estudiante of ListaEstudiantes) {
       
        lis += `<tr>
                  <td>${estudiante.cedula}</td>
                  <td>${estudiante.id_estudiante}</td>
                  <td>${estudiante.nombre}</td>
                  <td>${estudiante.apellido}</td>
                  <td>${estudiante.sexo}</td>
                  <td>${estudiante.fecha_naci? estudiante.fecha_naci.toLocaleDateString(): "N/A"}</td>
                  <td>${estudiante.fecha_fin_sancion ? estudiante.fecha_fin_sancion.toLocaleDateString() : "N/A"}</td>
                  <td class="action-buttons">
                      <button class="editar">Editar</button>
                      <button class="eliminar">Eliminar</button>
                  </td>
               </tr>`;
    }
    lista.innerHTML = lis;
}

// Cargar estudiantes desde la API
export async function cargarEstudiantes() {
    ListaEstudiantes = await getEstudiantes();
    for(let estudiante of ListaEstudiantes){
       let fecha_naci= mapearFecha(estudiante.fecha_naci);
       if(fecha_naci){
        estudiante.fecha_naci=fecha_naci;
       }
       let fecha_fin_sancion= mapearFecha(estudiante.fecha_fin_sancion);
       if(fecha_fin_sancion){
        estudiante.fecha_fin_sancion=fecha_fin_sancion;
       }

    }
}

function mapearFecha(fecha: Date | null): Date  | null  {
    let nuevaFecha;
  if(fecha){
    nuevaFecha = new Date(fecha);
    nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset());
    return nuevaFecha;
  }
  return null;
    
}

// Verificar si la cédula está repetida
function verificarCedulaRepetida(cedula: string, index?: number) {
    let elementoRepetido = ListaEstudiantes.find(est => est.cedula === cedula);

    if (elementoRepetido && typeof index === "number" && ListaEstudiantes.indexOf(elementoRepetido) !== index) {
        window.alert("La cédula ya existe");
        return true;
    } else if (elementoRepetido && index == null) {
        window.alert("La cédula ya existe");
        return true;
    }
    return false;
}

// Validaciones
function validaciones(cedula: string, nombre: string, apellido: string, fecha:Date): boolean {
    if (!cedula || cedula.length !== 10 || isNaN(Number(cedula))) {
        window.alert("Ingrese una cédula válida (10 dígitos)");
        return false;
    }
    if (!nombre.trim()) {
        window.alert("El nombre no puede estar vacío");
        return false;
    }
    if (!apellido.trim()) {
        window.alert("El apellido no puede estar vacío");
        return false;
    }

    if( isNaN(fecha.getTime())){
        window.alert("Ingrese una fecha válida");
        return false;
    }

    return true;
}

export  function obtenerEstudiante(id: number) {
    let estudiante = ListaEstudiantes.find((estudiante) => estudiante.id_estudiante == id);
    if (estudiante) {
      return estudiante;
    }
    return null;
  }