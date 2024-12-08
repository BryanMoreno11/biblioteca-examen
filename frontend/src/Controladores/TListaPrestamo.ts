import { Prestamo } from "../Entidades/Prestamo";
import { createPrestamo, getPrestamos, devolucion } from "../Servicios/ServicioPrestamo";
import { getLibro, updateStock } from "../Servicios/ServicioLibro";
import { getEstudiante, updateFechaSancion } from "../Servicios/ServicioEstudiante";
import { Categoria } from "../Entidades/Libro";
import { Estudiante } from "../Entidades/Estudiante";
export { ListaPrestamos };

let ListaPrestamos: Prestamo[] = [];

// Función insertar préstamo
export async function InsertarPrestamo() {
  let id_estudiante = Number((<HTMLInputElement>document.getElementById("id_estudiante")).value);
  let codigo = Number((<HTMLInputElement>document.getElementById("codigo")).value);
  let fecha_prestamo = new Date((<HTMLInputElement>document.getElementById("fecha_prestamo")).value);
  let fecha_entrega = new Date((<HTMLInputElement>document.getElementById("fecha_entrega")).value);
  fecha_prestamo.setMinutes(fecha_prestamo.getMinutes() + fecha_prestamo.getTimezoneOffset());
  fecha_entrega.setMinutes(fecha_entrega.getMinutes() + fecha_entrega.getTimezoneOffset());
  fecha_prestamo.setHours(0, 0, 0, 0);
  fecha_entrega.setHours(0, 0, 0, 0);

  console.log("La fecha de prestamo es ",fecha_prestamo);
  console.log("La fecha de entrega es ",fecha_entrega.toISOString());

  if (
    await validarEstudianteNoSancionado(id_estudiante, fecha_prestamo) &&
    await validarStockLibro(codigo) && await validarEdad(id_estudiante, codigo) &&
    validarPrestamoUnico(id_estudiante, codigo) &&
    validaciones(id_estudiante, codigo, fecha_prestamo, fecha_entrega)
  ) {
    let prestamo = new Prestamo(0, id_estudiante, codigo, fecha_prestamo, fecha_entrega,"Prestado", null );
    await createPrestamo(prestamo);
    await updateStock(codigo.toString(), (await getLibro(codigo.toString())).stock - 1);
    return true;
  }
  return false;
}

// Función realizar devolución
export async function RealizarDevolucion(id: number) {
  let fecha_devolucion = new Date((<HTMLInputElement>document.getElementById("fecha_devolucion")).value);
  fecha_devolucion.setMinutes(fecha_devolucion.getMinutes() + fecha_devolucion.getTimezoneOffset());
  fecha_devolucion.setHours(0, 0, 0, 0);
  let prestamo = ListaPrestamos.find(p => p.id_prestamo === id);
  
  if (!prestamo) {
    window.alert("Préstamo no encontrado");
    return;
  }
  prestamo.fecha_prestamo?.setMinutes( prestamo.fecha_prestamo.getMinutes() +  prestamo.fecha_prestamo.getTimezoneOffset());
  prestamo.fecha_prestamo?.setHours(0, 0, 0, 0);
  if (fecha_devolucion < prestamo.fecha_prestamo) {
    console.log("La fecha de devolucion es ",fecha_devolucion);
    console.log("La fecha de prestamo es ",prestamo.fecha_prestamo);
    window.alert("La fecha de devolución no puede ser anterior a la fecha de préstamo");
    return;
  }

  await devolucion(id.toString(), fecha_devolucion);

  if (fecha_devolucion > prestamo.fecha_entrega) {
    let fecha_sancion = new Date(fecha_devolucion);
    fecha_sancion.setDate(fecha_sancion.getDate() + 15);
    fecha_sancion.setMinutes(fecha_sancion.getMinutes() + fecha_sancion.getTimezoneOffset());
    fecha_sancion.setHours(0, 0, 0, 0);
    await updateFechaSancion(prestamo.id_estudiante.toString(), fecha_sancion);
    window.alert(`Entrega atrasada. El estudiante está sancionado hasta ${fecha_sancion.toLocaleDateString()}`);
  }
  await updateStock(prestamo.codigo.toString(), (await getLibro(prestamo.codigo.toString())).stock + 1);

 
}

// Función listar préstamos
export function ListarPrestamos() {
  console.log("lA LISTA DE PRESTAMOS ES", ListaPrestamos);
  let lis = "";
  let lista = <HTMLElement>document.getElementById("lista-prestamos");

  for (let prestamo of ListaPrestamos) {
    lis += `<tr>
              <td>${prestamo.id_prestamo}</td>
              <td>${prestamo.cedula_estudiante}</td>
              <td>${prestamo.nombre_libro}</td>
              <td>${prestamo.fecha_prestamo? prestamo.fecha_prestamo.toLocaleDateString():"N/A"}</td>
              <td>${prestamo.fecha_entrega? prestamo.fecha_entrega.toLocaleDateString(): "N/A"}</td>
              <td>${prestamo.fecha_devolucion? prestamo.fecha_devolucion.toLocaleDateString(): "N/A"}</td>
              <td>${prestamo.estado}</td>
              <td>
                  <button class="devolucion" ">Devolución</button>
              </td>
           </tr>`;
  }
  lista.innerHTML = lis;
}

// Función cargar préstamos
export async function cargarPrestamos() {
  ListaPrestamos = await getPrestamos();
  for(let prestamo of ListaPrestamos){
    let fecha_prestamo= mapearFecha(prestamo.fecha_prestamo);
    let fecha_entrega= mapearFecha(prestamo.fecha_entrega);
    let fecha_devolucion= mapearFecha(prestamo.fecha_devolucion);
    if(fecha_prestamo && fecha_entrega ){ 
     prestamo.fecha_prestamo=fecha_prestamo;
     prestamo.fecha_entrega=fecha_entrega;
     prestamo.fecha_devolucion=fecha_devolucion;
    }

 }
}

// Validaciones
function validaciones(id_estudiante: number, codigo: number, fecha_prestamo: Date, fecha_entrega: Date): boolean {
  if (id_estudiante <= 0 || isNaN(id_estudiante)) {
    window.alert("Ingrese un ID de estudiante válido");
    return false;
  }
  if (codigo <= 0 || isNaN(codigo)) {
    window.alert("Ingrese un código válido");
    return false;
  }
  if (fecha_prestamo > fecha_entrega) {
    window.alert("La fecha de entrega  debe ser posterior a la fecha de préstamo");
    return false;
  }
  return true;
}

async function validarEstudianteNoSancionado(id_estudiante: number, fecha_prestamo: Date): Promise<boolean> {
  let estudiante = await getEstudiante(id_estudiante.toString());
  let fecha_fin_sancion= mapearFecha(estudiante.fecha_fin_sancion);
  if ( fecha_fin_sancion && fecha_fin_sancion  >= fecha_prestamo) {
    window.alert(`El estudiante está sancionado hasta ${fecha_fin_sancion.toLocaleDateString()}`);
    return false;
  }
  return true;
}
async function validarStockLibro(codigo: number): Promise<boolean> {
  let libro = await getLibro(codigo.toString());
  if (libro.stock <= 0) {
    window.alert("No hay stock disponible para este libro");
    return false;
  }
  return true;
}

function validarPrestamoUnico(id_estudiante: number, codigo: number): boolean {
  console.log("La lista de presamos es: ", ListaPrestamos);
  let prestamoExistente = ListaPrestamos.find(p => p.id_estudiante == id_estudiante && p.codigo == codigo && p.estado == "Prestado");
  if (prestamoExistente) {
    window.alert("El estudiante ya tiene este libro en préstamo");
    return false;
  }
  return true;
}

async function validarEdad(id_estudiante:number, codigo:number):Promise<boolean>{
    let data:Estudiante= await getEstudiante(id_estudiante.toString());
   let estudiante= new Estudiante(data.id_estudiante,data.cedula,data.nombre,data.apellido,data.sexo,data.fecha_naci);
    let libro= await getLibro(codigo.toString());
    if(libro.categoria==Categoria.Erotico && estudiante.calcularEdad()<18){
      window.alert("El estudiante es menor de edad por eso no puede solicitar este libro");
      return false;
    }
    return true;
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
