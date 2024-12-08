export class Prestamo {
    id_prestamo: number;
    cedula_estudiante: string | null;  // No se usa para la creación, pero se inicializa como null
    nombre_libro: string | null;       // No se usa para la creación, pero se inicializa como null
    id_estudiante: number;
    codigo: number;
    fecha_prestamo: Date;
    fecha_entrega: Date;
    fecha_devolucion: Date | null;
    estado: string;

    constructor(
        id_prestamo: number,
        id_estudiante: number,
        codigo: number,
        fecha_prestamo: Date,
        fecha_entrega: Date,
        estado: string,
        fecha_devolucion: Date | null = null,
        cedula_estudiante: string | null = null,  // Se inicializa como null
        nombre_libro: string | null = null        // Se inicializa como null
    ) {
        this.id_prestamo = id_prestamo;
        this.cedula_estudiante = cedula_estudiante;  // No se usa, pero se inicializa como null
        this.nombre_libro = nombre_libro;            // No se usa, pero se inicializa como null
        this.id_estudiante = id_estudiante;
        this.codigo = codigo;
        this.fecha_prestamo = fecha_prestamo;
        this.fecha_entrega = fecha_entrega;
        this.fecha_devolucion = fecha_devolucion;
        this.estado = estado;
    }
}
