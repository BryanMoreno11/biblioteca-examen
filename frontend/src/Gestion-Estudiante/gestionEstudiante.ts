import {
    Editar,
    Insertar,
    cargarEstudiantes,
    obtenerEstudiante,
  } from "../Controladores/TListaEstudiante";
  import { Estudiante, Sexo } from "../Entidades/Estudiante";
  
  // Variables
  let button = document.getElementById("btn") as HTMLButtonElement;
  let estudiante: Estudiante | null = null;
  let id_estudiante: number | null;
  let selectSexo = document.getElementById("sexo") as HTMLSelectElement;
  let valoresSexo = Object.values(Sexo);
  
  // Inicialización
  id_estudiante = Number(obtenerValorUrl("id_estudiante"));
  
  cargarEstudiantes().then(() => {
    if (id_estudiante) {
      estudiante = obtenerEstudiante(id_estudiante);
      llenarFormulario();
    }
  });
  
  llenarSelect(valoresSexo, selectSexo);
  button.addEventListener("click", save);
  
  // Funciones
  function save(e: Event): void {
    e.preventDefault();
    if (estudiante) {
      Editar(estudiante.id_estudiante).then((res) => {
        if (res) {
          window.alert("Estudiante editado");
          window.location.href = "./indexEstudiante.html";
        }
      });
    } else {
      Insertar().then((res) => {
        if (res) {
          window.alert("Estudiante insertado");
          limpiarFormulario();
          cargarEstudiantes();
        }
      });
    }
  }
  
  function obtenerValorUrl(nombreCampo: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombreCampo);
  }
  
  function llenarFormulario(): void {
    if (estudiante) {
      (<HTMLInputElement>document.getElementById("cedula")).value = estudiante.cedula;
      (<HTMLInputElement>document.getElementById("nombre")).value = estudiante.nombre;
      (<HTMLInputElement>document.getElementById("apellido")).value = estudiante.apellido;
      (<HTMLSelectElement>document.getElementById("sexo")).value = estudiante.sexo;
      (<HTMLInputElement>document.getElementById("fechaNaci")).value = estudiante.fecha_naci.toISOString().split('T')[0];
    }
  }
  
  function limpiarFormulario(): void {
    (<HTMLInputElement>document.getElementById("cedula")).value = "";
    (<HTMLInputElement>document.getElementById("nombre")).value = "";
    (<HTMLInputElement>document.getElementById("apellido")).value = "";
    (<HTMLSelectElement>document.getElementById("sexo")).value = Sexo.M;
    (<HTMLInputElement>document.getElementById("fechaNaci")).value = "";
  }
  
  function llenarSelect(valores: string[], select: HTMLSelectElement): void {
    valores.forEach((valor) => {
      let option = document.createElement("option");
      option.value = valor;
      option.text = valor === "M" ? "Masculino" : "Femenino";
      select.appendChild(option);
    });
  }
  