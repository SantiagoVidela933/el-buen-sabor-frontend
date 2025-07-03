import { CategoriaArticulo } from './CategoriaArticulo';

export class ArticuloVenta {
    id: number;
    tipo: string;
    denominacion: string;
    descripcion: string | null;
    categoriaArticulo: CategoriaArticulo | null;
    precioVenta: number;
    imagenUrl: string | null;
    stockDisponible: number;

    constructor(
        id: number,
        tipo: string,
        denominacion: string,
        descripcion: string | null,
        categoriaArticulo: CategoriaArticulo | null,
        precioVenta: number,
        imagenUrl: string | null,
        stockDisponible: number
    ) {
        this.id = id;
        this.tipo = tipo;
        this.denominacion = denominacion;
        this.descripcion = descripcion;
        this.categoriaArticulo = categoriaArticulo;
        this.precioVenta = precioVenta;
        this.imagenUrl = imagenUrl;
        this.stockDisponible = stockDisponible;
    }
    static fromJson(json: any): ArticuloVenta {
        const categoriaArticulo = json.categoriaArticulo
            ? new CategoriaArticulo(
                json.categoriaArticulo.id,
                json.categoriaArticulo.denominacion
            )
        : null;
        return new ArticuloVenta(
            json.id,
            json.tipo,
            json.denominacion,
            json.descripcion,
            categoriaArticulo,
            json.precioVenta,
            json.imagenUrl,
            json.stockDisponible
        );
    }
}

export default ArticuloVenta;

