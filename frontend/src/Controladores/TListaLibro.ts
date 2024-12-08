import { Libro } from "../Entidades/Libro";
import { createLibro, deleteLibro, getLibros, updateLibro } from "../Servicios/ServicioLibro";
export { ListaLibros };

let ListaLibros: Libro[] = [
];

// Funcion insertar libros
export async function Insertar(imagen: string) {
  let img: string = "";
  let cod = Number(
    (<HTMLInputElement>document.getElementById("codigo")).value.toString()
  );
  let categoria = (<HTMLInputElement>(
    document.getElementById("selectCategoria")
  )).value.toString();

  let tipo = (<HTMLInputElement>(
    document.getElementById("selectTipo")
  )).value.toString();

  let nom = (<HTMLInputElement>(
    document.getElementById("nombre")
  )).value.toString();

  let editorial = (<HTMLInputElement>(
    document.getElementById("editorial")
  )).value.toString();

  let autor = (<HTMLInputElement>(
    document.getElementById("autor")
  )).value.toString()

  let stock= Number(
    (<HTMLInputElement>document.getElementById("stock")).value.toString()
  );

  let anioPublicacion = Number(
    (<HTMLInputElement>document.getElementById("anio")).value.toString()
  );
  img = imagen;

  if(verificarCodigoRepetido(cod)==false && validaciones(cod, stock,nom,anioPublicacion)==true){
    let obj= new Libro(cod,categoria,tipo,nom,editorial,autor,anioPublicacion,stock, img);
    await createLibro(obj);
     return true;
  }
  return false;

}

// Funcion Editar
export async function Editar(codigo: number, imagen: string) {
  let cod = Number(
    (<HTMLInputElement>document.getElementById("codigo")).value.toString()
  );
  let categoria = (<HTMLInputElement>(
    document.getElementById("selectCategoria")
  )).value.toString();

  let tipo = (<HTMLInputElement>(
    document.getElementById("selectTipo")
  )).value.toString();

  let nom = (<HTMLInputElement>(
    document.getElementById("nombre")
  )).value.toString();

  let editorial = (<HTMLInputElement>(
    document.getElementById("editorial")
  )).value.toString();

  let autor = (<HTMLInputElement>(
    document.getElementById("autor")
  )).value.toString()

  let anioPublicacion = Number(
    (<HTMLInputElement>document.getElementById("anio")).value.toString()
  );
  let stock= Number(
    (<HTMLInputElement>document.getElementById("stock")).value.toString()
  );
  let img = imagen;
  let index = ListaLibros.findIndex((libro) => libro.codigo === codigo);
  let libroAux = ListaLibros[index];
  if (img == null || img == "") {
    img = libroAux.imagen;
  }
  let codigoRepetido = verificarCodigoRepetido(cod, index);
  if (
    index !== -1 && codigoRepetido == false && validaciones(cod, stock,nom,anioPublicacion)==true
  ) {
    let libro= new Libro(cod,categoria,tipo,nom,editorial,autor,anioPublicacion, stock, img);
    await updateLibro(cod.toString(), libro);
    return true;
  }
  return false;
}

// Funcion Eliminar
export async function Eliminar(codigo: number) {
  await deleteLibro(codigo.toString());
}

// Funcion listar heroes
export function Listar() {
  console.log("La lista de libros es ", ListaLibros);
  let lis = "";
  let lista = <HTMLElement>document.getElementById("lista-h");
  console.log("La longitud de la lista de libros es ", ListaLibros.length);
  for (let i = 0; i < ListaLibros.length; i++) {
    lis =
      "<tr>" +
      lis+
      ` <td><img src=${ListaLibros[i].imagen} alt=""></td>` +
      "<td>" +
      ListaLibros[i].codigo +
      "</td>" +
      "<td>" +
      ListaLibros[i].nombre +
      "</td>" +
      "<td>" +
      ListaLibros[i].categoria +
      "</td>" +
      "<td>" +
      ListaLibros[i].tipo +
      "</td>" +
      "<td>" +
      ListaLibros[i].stock +
      "</td>" +
      ` <td class="action-buttons">
                          <button  class="editar">Editar</button>
                          <button  class="eliminar">Eliminar</button>
                      </td></tr>`;
  }
  lista.innerHTML = lis;
}

export  function obtenerLibro(codigo: number) {
  let libro = ListaLibros.find((libro) => libro.codigo == codigo);
  if (libro) {
    return libro;
  }
  return null;
}

export async function cargarLibros(){
 ListaLibros= await getLibros();

}

function verificarCodigoRepetido(codigo: number, index?: number) {
  let elementoRepetido = ListaLibros.find(
    (libro: Libro) => libro.codigo == codigo
  );

  if (
    elementoRepetido &&
    typeof index == "number" &&
    ListaLibros.indexOf(elementoRepetido) != index
  ) {
    window.alert("El codigo ya existe");
    return true;
  } else if (elementoRepetido && index == null) {
    window.alert("El codigo ya existe");
    return true;
  } else {
    return false;
  }
}

function validaciones (codigo:number, stock:number, nombre:string, anio:number){
  console.log("El codigo es ", codigo);
    if(codigo<=0 || codigo%1!=0 ){
      window.alert("Ingrese un código correcto");
      return false;
    }
    if(stock<=0 || stock%1!=0){
      window.alert("Ingrese un stock correcto");
      return false;
    }

    if(nombre.length<=0){
      window.alert("Ingrese un nombre correcto");
      return false;
    }

    if(anio<=0 || anio%1!=0 ){
      window.alert("Ingrese un año correcto");
      return false;
    }
    return true;
}
