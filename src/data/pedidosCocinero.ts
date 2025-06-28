import { Column } from "../components/CocineroViews/PedidosView";
import { PedidoCocinero } from "../models/Orders/PedidoCocinero";
import { PedidoProducto } from "../models/Orders/PedidoProducto";
import { Product } from "../models/Products/Product";

// Productos de ejemplo
const productosEjemplo: Product[] = [
  new Product(
    1,
    "Pizza Margarita",
    "Deliciosa pizza con tomate y mozzarella",
    12.99,
    {} as any,
    [],
    undefined,
    undefined,
    undefined,
    undefined
  ),
  new Product(
    2,
    "Hamburguesa Clásica",
    "Hamburguesa con queso, lechuga y tomate",
    10.5,
    {} as any,
    [],
    undefined,
    undefined,
    undefined,
    undefined
  ),
  new Product(
    3,
    "Ensalada César",
    "Lechuga, croutons, queso parmesano y aderezo César",
    8.25,
    {} as any,
    [],
    undefined,
    undefined,
    undefined,
    undefined
  ),
  new Product(
    4,
    "Pasta Alfredo",
    "Pasta con salsa cremosa Alfredo y pollo",
    14.75,
    {} as any,
    [],
    undefined,
    undefined,
    undefined,
    undefined
  ),
  new Product(
    5,
    "Taco de Carnitas",
    "Taco con carne de cerdo, cebolla y cilantro",
    7.5,
    {} as any,
    [],
    undefined,
    undefined,
    undefined,
    undefined
  ),
];

// Función para obtener una cantidad aleatoria entre min y max
const randomCantidad = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Crear pedidos con productos aleatorios y cantidades
const pedidos: PedidoCocinero[] = [
  new PedidoCocinero(
    1,
    "2024-05-20",
    "15 min",
    "12:30",
    [
      new PedidoProducto(productosEjemplo[0], randomCantidad(1, 3)),
      new PedidoProducto(productosEjemplo[2], randomCantidad(1, 2)),
    ]
  ),
  new PedidoCocinero(
    2,
    "2024-05-19",
    "20 min",
    "13:00",
    [
      new PedidoProducto(productosEjemplo[1], randomCantidad(1, 4)),
      new PedidoProducto(productosEjemplo[3], randomCantidad(1, 1)),
      new PedidoProducto(productosEjemplo[4], randomCantidad(2, 5)),
    ]
  ),
  new PedidoCocinero(
    3,
    "2024-05-18",
    "10 min",
    "12:00",
    [
      new PedidoProducto(productosEjemplo[2], randomCantidad(1, 3)),
    ]
  ),
  new PedidoCocinero(
    4,
    "2024-05-17",
    "25 min",
    "14:00",
    [
      new PedidoProducto(productosEjemplo[0], 1),
      new PedidoProducto(productosEjemplo[1], 2),
      new PedidoProducto(productosEjemplo[4], 1),
    ]
  ),
  new PedidoCocinero(
    5,
    "2024-05-16",
    "30 min",
    "15:00",
    [
      new PedidoProducto(productosEjemplo[3], randomCantidad(1, 2)),
      new PedidoProducto(productosEjemplo[0], randomCantidad(1, 1)),
    ]
  ),
  new PedidoCocinero(
    6,
    "2024-05-15",
    "18 min",
    "13:15",
    []
  ), // Pedido sin productos
];

// Definición columns (sin cambios)
export const columns: Column<PedidoCocinero>[] = [
  { header: "Pedido", accessor: "pedido" },
  { header: "Fecha", accessor: "fecha" },
  { header: "Tiempo de preparación", accessor: "tiempoDePreparacion" },
  { header: "Hora estimada", accessor: "horaEstimada" },
];

export { pedidos };
