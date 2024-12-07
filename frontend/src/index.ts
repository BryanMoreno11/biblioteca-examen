import { Listar, Eliminar, cargarLibros } from "../src/Controladores/TListaLibro";
cargarLibros().then(()=>Listar());

//region variables
const tabla = document.getElementById("tabla-H") as HTMLTableElement;
let primerValor = 0;
//region Eventos

//Se obtiene el codigo para editar
tabla.addEventListener("click", (event) => {
  const target = event.target as HTMLButtonElement;
  let parent = target.parentNode?.parentNode;
  if (target.classList.contains("editar") && parent) {
    const fila = parent;
    let codigo=  Number(fila.children[1].innerHTML);
      window.location.href=`/src/Gestion-Libros/gestionLibros.html?codigo=${codigo}`
  }
});

//Funcion Eliminar
tabla.addEventListener("click", (event) => {
  const target = event.target as HTMLButtonElement;
  let parent = target.parentNode?.parentNode;
  if (target.classList.contains("eliminar") && parent) {
    const fila = parent;
    primerValor = Number(fila.children[1].innerHTML);
    const confirmacion = window.confirm("¿Está seguro de que quiere eliminar este registro?");

    if (confirmacion) {
      Eliminar(primerValor).then(() =>  
        cargarLibros().then(() => Listar()));
      primerValor = 0;
    }
  }
});

