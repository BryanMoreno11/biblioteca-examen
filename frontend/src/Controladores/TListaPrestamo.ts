import { Prestamo } from "../Entidades/Prestamo";
import { createPrestamo, getPrestamos, devolucion } from "../Servicios/ServicioPrestamo";
import { getLibro, updateStock } from "../Servicios/ServicioLibro";
import { getEstudiante, updateFechaSancion } from "../Servicios/ServicioEstudiante";
import { Categoria } from "../Entidades/Libro";
import { Estudiante } from "../Entidades/Estudiante";
export { ListaPrestamos };

let ListaPrestamos: Prestamo[] = [];

export async function InsertarPrestamos(id_estudiante: number, librosSeleccionados: number[], fecha_prestamo: Date, fecha_entrega: Date) {

  if (!(await validarEstudianteNoSancionado(id_estudiante, fecha_prestamo)) || !validaciones(id_estudiante, fecha_prestamo, fecha_entrega)) {
      return false;
  }

  
  try {
      await createPrestamo(id_estudiante, librosSeleccionados, fecha_prestamo, fecha_entrega);

      for (let codigo of librosSeleccionados) {
          let libro = await getLibro(codigo.toString());
          await updateStock(codigo.toString(), libro.stock-1);
      }
      window.alert("Préstamos registrados exitosamente.");
      return true;
  } catch (error) {
      console.error("Error al registrar los préstamos:", error);
      window.alert("Ocurrió un error al registrar los préstamos.");
      return false;
  }
}

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
function validaciones(id_estudiante: number,  fecha_prestamo: Date, fecha_entrega: Date): boolean {
  if (id_estudiante <= 0 || isNaN(id_estudiante)) {
    window.alert("Ingrese un ID de estudiante válido");
    return false;
  }
  
  if (fecha_prestamo > fecha_entrega) {
    window.alert("La fecha de entrega  debe ser posterior a la fecha de préstamo");
    return false;
  }
  return true;
}

export async function validarEstudianteNoSancionado(id_estudiante: number, fecha_prestamo: Date): Promise<boolean> {
  let estudiante = await getEstudiante(id_estudiante.toString());
  let fecha_fin_sancion= mapearFecha(estudiante.fecha_fin_sancion);
  if ( fecha_fin_sancion && fecha_fin_sancion  >= fecha_prestamo) {
    window.alert(`El estudiante está sancionado hasta ${fecha_fin_sancion.toLocaleDateString()}`);
    return false;
  }
  return true;
}
export async function validarStockLibro(codigo: number): Promise<boolean> {
  let libro = await getLibro(codigo.toString());
  if (libro.stock <= 0) {
    window.alert("No hay stock disponible para este libro");
    return false;
  }
  return true;
}

export function validarPrestamoUnico(id_estudiante: number, codigo: number): boolean {
  console.log("La lista de presamos es: ", ListaPrestamos);
  let prestamoExistente = ListaPrestamos.find(p => p.id_estudiante == id_estudiante && p.codigo == codigo && p.estado == "Prestado");
  if (prestamoExistente) {
    window.alert("El estudiante ya tiene este libro en préstamo");
    return false;
  }
  return true;
}

export async function validarEdad(id_estudiante:number, codigo:number):Promise<boolean>{
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
