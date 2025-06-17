import { CategoriaArticulo } from './CategoriaArticulo';

export class ArticuloVenta {
    id: number;
    tipo: string;
    denominacion: string;
    descripcion: string | null;
    categoria: CategoriaArticulo | null;
    precioVenta: number;
    imagenUrl: string | null;
    stockDisponible: number;

    constructor(
        id: number,
        tipo: string,
        denominacion: string,
        descripcion: string | null,
        categoria: CategoriaArticulo | null,
        precioVenta: number,
        imagenUrl: string | null,
        stockDisponible: number
    ) {
        this.id = id;
        this.tipo = tipo;
        this.denominacion = denominacion;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precioVenta = precioVenta;
        this.imagenUrl = imagenUrl;
        this.stockDisponible = stockDisponible;
    }
    // Método estático para mapear datos JSON a una instancia de ArticuloVenta
    static fromJson(json: any): ArticuloVenta {
        return new ArticuloVenta(
            json.id,
            json.tipo,
            json.denominacion,
            json.descripcion,
            json.categoria || null,
            json.precioVenta,
            json.imagenUrl || null,
            json.stockDisponible
        );
    }
}

export default ArticuloVenta;

