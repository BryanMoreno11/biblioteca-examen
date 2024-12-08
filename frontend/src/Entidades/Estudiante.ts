export class Estudiante {
    id_estudiante: number;
    cedula: string;
    nombre: string;
    apellido: string;
    sexo: string;
    fecha_naci: Date;
    fecha_fin_sancion: Date | null ;

    constructor(id_estudiante: number, cedula: string, nombre: string, apellido: string, sexo: string, fecha_naci: Date) {
        this.id_estudiante = id_estudiante;
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sexo = sexo;
        this.fecha_naci = fecha_naci;
        this.fecha_fin_sancion = null;
    }

    calcularEdad() {
        const hoy = new Date();
        const nacimiento = new Date(this.fecha_naci);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }
}

export enum Sexo {
    M = "M",
    F = "F",
}
