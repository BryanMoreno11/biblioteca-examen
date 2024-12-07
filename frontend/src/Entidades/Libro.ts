export class Libro{
    codigo:number;
    categoria:string;
    tipo:string;
    nombre:string;
    editorial:string;
    autor:string;
    anio_publicacion:number;
    stock:number;
    imagen:string;

    constructor(codigo:number, categoria:string, tipo:string, nombre:string, editorial:string, autor:string,
        anioPublicacion:number, stock:number, imagen:string
    ){
        this.codigo=codigo;
        this.categoria=categoria;
        this.tipo= tipo;
        this.nombre=nombre;
        this.editorial=editorial;
        this.autor=autor;
        this.anio_publicacion=anioPublicacion;
        this.stock=stock;
        this.imagen= imagen
    }
}

export enum Tipo{
    Libro="Libro",
    Revista="Revista"
   
}

export enum Categoria{
    Literatura="Literatura",
    Salud="Salud",
    Informatica="Informatica",
    Erotico="Erotico",
}

