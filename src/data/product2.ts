import { Product } from "../models/Products/Product";
import { ProductDetails } from "../models/Products/ProductDetails";
import { Image } from "../models/Products/Image";
import { MeasurementUnit } from "../models/Products/Ingredient/MeasurementUnit";
import { pizzaCategory, burgerCategory } from "./productCategories";
import {
  tomate,
  mozzarella,
  albahaca,
  carneVacuna,
  lechuga,
  quesoCheddar,
  panHamburguesa,
} from "./ingredient";

import pizzaImg from "../assets/images/pizza_example.jpg";
import hamburguesaImg from "../assets/images/burger_example.jpg";

export const productosIniciales: Product[] = [
  new Product(
    1,
    "Pizza Margherita",
    "Pizza clásica con tomate, mozzarella y albahaca.",
    500,
    pizzaCategory,
    [
      new ProductDetails(1, tomate, 80, MeasurementUnit.g),
      new ProductDetails(2, mozzarella, 100, MeasurementUnit.g),
      new ProductDetails(3, albahaca, 5, MeasurementUnit.g),
    ],
    "Alta",
    15,
    undefined,
    new Image(1, "pizza_margherita.jpg", pizzaImg)
  ),
  new Product(
    2,
    "Hamburguesa Clásica",
    "Jugosa hamburguesa con carne vacuna, lechuga, tomate y queso cheddar.",
    750,
    burgerCategory,
    [
      new ProductDetails(4, carneVacuna, 150, MeasurementUnit.g),
      new ProductDetails(5, lechuga, 30, MeasurementUnit.g),
      new ProductDetails(6, tomate, 40, MeasurementUnit.g),
      new ProductDetails(7, quesoCheddar, 25, MeasurementUnit.g),
      new ProductDetails(8, panHamburguesa, 1, MeasurementUnit.u),
    ],
    "Baja",
    10,
    undefined,
    new Image(2, "hamburguesa_clasica.jpg", hamburguesaImg)
  )
];
