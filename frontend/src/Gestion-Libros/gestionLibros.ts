import {
  Editar,
  Insertar,
  obtenerLibro,
  cargarLibros,
} from "../Controladores/TListaLibro";
import { Libro, Tipo, Categoria } from "../Entidades/Libro";
//region variables
let imagenUrl: string | ArrayBuffer | null;
let inputImagen = document.getElementById("inputImage") as HTMLInputElement;
let preview = document.getElementById("imagenPrevia") as HTMLImageElement;
let button = document.getElementById("btn") as HTMLButtonElement;
let libro: Libro | null = null;
let codigo: number | null;
//selects
let selectTipo = document.getElementById("selectTipo") as HTMLSelectElement;
let valoresTipo = Object.values(Tipo);
let selectCategoria = document.getElementById(
  "selectCategoria"
) as HTMLSelectElement;
let valoresCategoria = Object.values(Categoria);
//region eventos
codigo = Number(obtenerValorUrl("codigo"));
//region init
cargarLibros().then(()=>{
  if (codigo) {
    console.log("el codigo es ",codigo);
    libro = obtenerLibro(codigo);
    llenarFormulario();
  }
});

llenarSelect(valoresTipo, selectTipo);
llenarSelect(valoresCategoria, selectCategoria);
button.addEventListener("click", save);

inputImagen.addEventListener("change", function (event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        var src = reader.result;
        imagenUrl = src;
        preview.src = imagenUrl as string;
      },
      false
    );
    reader.readAsDataURL(input.files[0]);
  }
});

//region funciones

function save(e: Event): void {
  e.preventDefault();
  if (libro) {
    Editar(libro.codigo, imagenUrl as string).then((res) => {
      if (res == true) {
        window.alert("Libro editado");
        window.location.href=`../index.html`
      }
    });
  } else {
    Insertar(imagenUrl as string).then((res) => {
      if (res == true) {
        window.alert("Libro insertado");
        limpiarFormulario();
        cargarLibros();
      }
    });
  }
}

function obtenerValorUrl(nombreCampo: string) {
  const urlParams = new URLSearchParams(window.location.search);
  const valor = urlParams.get(nombreCampo);
  return valor;
}

function llenarFormulario() {
  if (libro) {
    (<HTMLInputElement>document.getElementById("codigo")).value =
      libro.codigo.toString();
    (<HTMLInputElement>document.getElementById("selectCategoria")).value =
      libro.categoria;
    (<HTMLInputElement>document.getElementById("selectTipo")).value =
      libro.tipo;
    (<HTMLInputElement>document.getElementById("stock")).value =
      libro.stock.toString();
    (<HTMLInputElement>document.getElementById("nombre")).value = libro.nombre;
    (<HTMLInputElement>document.getElementById("editorial")).value =
      libro.editorial;
    (<HTMLInputElement>document.getElementById("autor")).value = libro.autor;
    (<HTMLInputElement>document.getElementById("anio")).value =
      libro.anio_publicacion.toString();
    (<HTMLImageElement>document.getElementById("imagenPrevia")).src =
      libro.imagen;
  }
}

function limpiarFormulario() {
  (<HTMLInputElement>document.getElementById("codigo")).value = '';
  (<HTMLInputElement>document.getElementById("selectCategoria")).value = Categoria.Literatura;
  (<HTMLInputElement>document.getElementById("selectTipo")).value = Tipo.Libro;
  (<HTMLInputElement>document.getElementById("stock")).value = '';
  (<HTMLInputElement>document.getElementById("nombre")).value = '';
  (<HTMLInputElement>document.getElementById("editorial")).value = '';
  (<HTMLInputElement>document.getElementById("autor")).value = '';
  (<HTMLInputElement>document.getElementById("anio")).value = '';
  (<HTMLImageElement>document.getElementById("imagenPrevia")).src = ''; // Limpiar la imagen previa
}


function llenarSelect(valores: string[], select: HTMLSelectElement) {
  valores.forEach((valor) => {
    let option = document.createElement("option");
    option.value = valor;
    option.text = valor;
    select.appendChild(option);
  });
}
