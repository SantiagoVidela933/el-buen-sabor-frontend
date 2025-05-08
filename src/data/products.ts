import { Product } from "../models/Product";

export const products = [
  new Product(
    1,
    "Pizza Margherita",
    "/src/assets/images/pizza_example.jpg",
    "Pizza clásica con tomate, mozzarella y albahaca.",
    500,
    "pizza"
  ),
  new Product(
    2,
    "Hamburguesa Completa",
    "/src/assets/images/burger_example.jpg",
    "Hamburguesa con carne, queso, lechuga, tomate y mayonesa.",
    350,
    "burger"
  ),
  new Product(
    3,
    "Pancho Completo",
    "/src/assets/images/pancho_example.jpg",
    "Pancho con mostaza y ketchup.",
    120,
    "panchos"
  ),
  new Product(
    4,
    "Coca-Cola",
    "/src/assets/images/bebida_example.jpg",
    "Refresco de cola, 500ml.",
    80,
    "bebida"
  ),
  new Product(
    5,
    "Papas Fritas",
    "/src/assets/images/fritas_example.jpg",
    "Papas fritas crujientes.",
    150,
    "papas"
  ),
  new Product(
    6,
    "Papas Fritas Con Cheddar",
    "/src/assets/images/fritas_example.jpg",
    "Papas fritas con mucho cheddar.",
    250,
    "papas"
  ),
];
