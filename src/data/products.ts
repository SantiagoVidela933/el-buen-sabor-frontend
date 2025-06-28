import { Product } from "../models/Products/Product";
import { Image } from "../models/Products/Image";
import { ProductCategory } from "../models/Products/ProductCategory";

// 🖼️ Imports de imágenes
import pizzaImg from "/src/assets/images/pizza_example.jpg";
import burgerImg from "/src/assets/images/burger_example.jpg";
import panchoImg from "/src/assets/images/pancho_example.jpg";
import bebidaImg from "/src/assets/images/bebida_example.jpg";
import fritasImg from "/src/assets/images/fritas_example.jpg";

// 📂 Categorías
const pizzaCategory = new ProductCategory(1, "pizza");
const burgerCategory = new ProductCategory(2, "burger");
const panchoCategory = new ProductCategory(3, "panchos");
const bebidaCategory = new ProductCategory(4, "bebida");
const papasCategory = new ProductCategory(5, "papas");

// 📦 Productos
export const products: Product[] = [
  // 🍕 PIZZAS
  new Product(1, "Pizza Margherita", "Pizza clásica con tomate, mozzarella y albahaca.", 500, pizzaCategory, [], true, 15, undefined, new Image(1, "pizza_margherita.jpg", pizzaImg)),
  new Product(2, "Pizza Pepperoni", "Con pepperoni picante y queso fundido.", 650, pizzaCategory, [], true, 17, undefined, new Image(2, "pizza_pepperoni.jpg", pizzaImg)),
  new Product(3, "Pizza Napolitana", "Mozzarella, tomate en rodajas y ajo.", 600, pizzaCategory, [], true, 16, undefined, new Image(3, "pizza_napolitana.jpg", pizzaImg)),
  new Product(4, "Pizza Fugazzeta", "Cebolla, mozzarella y orégano.", 550, pizzaCategory, [], true, 18, undefined, new Image(4, "pizza_fugazzeta.jpg", pizzaImg)),
  new Product(5, "Pizza Cuatro Quesos", "Mozzarella, azul, provolone y parmesano.", 700, pizzaCategory, [], true, 20, undefined, new Image(5, "pizza_4quesos.jpg", pizzaImg)),

  // 🍔 HAMBURGUESAS
  new Product(6, "Hamburguesa Clásica", "Carne, lechuga, tomate y mayonesa.", 350, burgerCategory, [], true, 10, undefined, new Image(6, "burger_clasica.jpg", burgerImg)),
  new Product(7, "Hamburguesa con Cheddar", "Con doble cheddar fundido.", 400, burgerCategory, [], true, 12, undefined, new Image(7, "burger_cheddar.jpg", burgerImg)),
  new Product(8, "Hamburguesa Doble Carne", "Doble medallón, panceta y cheddar.", 550, burgerCategory, [], true, 14, undefined, new Image(8, "burger_doble.jpg", burgerImg)),
  new Product(9, "Hamburguesa BBQ", "Salsa barbacoa, cebolla crispy y cheddar.", 480, burgerCategory, [], true, 13, undefined, new Image(9, "burger_bbq.jpg", burgerImg)),
  new Product(10, "Hamburguesa Vegana", "Medallón vegetal, lechuga, tomate y aderezo vegano.", 420, burgerCategory, [], true, 11, undefined, new Image(10, "burger_vegana.jpg", burgerImg)),

  // 🌭 PANCHOS
  new Product(11, "Pancho Clásico", "Con ketchup y mostaza.", 120, panchoCategory, [], true, 5, undefined, new Image(11, "pancho_clasico.jpg", panchoImg)),
  new Product(12, "Pancho con Cheddar", "Baño de cheddar fundido.", 180, panchoCategory, [], true, 6, undefined, new Image(12, "pancho_cheddar.jpg", panchoImg)),
  new Product(13, "Pancho con Bacon", "Trozos de panceta y salsa cheddar.", 200, panchoCategory, [], true, 7, undefined, new Image(13, "pancho_bacon.jpg", panchoImg)),
  new Product(14, "Pancho Picante", "Salsa picante y jalapeños.", 190, panchoCategory, [], true, 6, undefined, new Image(14, "pancho_picante.jpg", panchoImg)),
  new Product(15, "Pancho Completo", "Con papas pay, mayonesa y ketchup.", 160, panchoCategory, [], true, 5, undefined, new Image(15, "pancho_completo.jpg", panchoImg)),

  // 🥤 BEBIDAS
  new Product(16, "Coca-Cola", "Botella 500ml.", 80, bebidaCategory, [], true, 0, undefined, new Image(16, "coca_cola.jpg", bebidaImg)),
  new Product(17, "Agua Mineral", "Botella sin gas, 500ml.", 60, bebidaCategory, [], true, 0, undefined, new Image(17, "agua_mineral.jpg", bebidaImg)),
  new Product(18, "Sprite", "Refresco lima-limón, 500ml.", 80, bebidaCategory, [], true, 0, undefined, new Image(18, "sprite.jpg", bebidaImg)),
  new Product(19, "Fanta", "Refresco sabor naranja, 500ml.", 80, bebidaCategory, [], true, 0, undefined, new Image(19, "fanta.jpg", bebidaImg)),
  new Product(20, "Jugo de Naranja", "Jugo natural exprimido, 350ml.", 100, bebidaCategory, [], true, 0, undefined, new Image(20, "jugo_naranja.jpg", bebidaImg)),

  // 🍟 PAPAS
  new Product(21, "Papas Clásicas", "Papas crujientes con sal.", 150, papasCategory, [], true, 7, undefined, new Image(21, "papas_clasicas.jpg", fritasImg)),
  new Product(22, "Papas con Cheddar", "Con abundante cheddar derretido.", 250, papasCategory, [], true, 8, undefined, new Image(22, "papas_cheddar.jpg", fritasImg)),
  new Product(23, "Papas con Cheddar y Bacon", "Con cheddar y panceta crocante.", 300, papasCategory, [], true, 9, undefined, new Image(23, "papas_bacon.jpg", fritasImg)),
  new Product(24, "Papas Provenzal", "Con ajo, perejil y manteca.", 200, papasCategory, [], true, 8, undefined, new Image(24, "papas_provenzal.jpg", fritasImg)),
  new Product(25, "Papas a la BBQ 1", "Con salsa barbacoa y cheddar.", 280, papasCategory, [], true, 9, undefined, new Image(25, "papas_bbq1.jpg", fritasImg)),
  new Product(26, "Papas a la BBQ 2", "Con salsa barbacoa y cheddar.", 280, papasCategory, [], true, 10, undefined, new Image(26, "papas_bbq2.jpg", fritasImg)),
  new Product(27, "Papas a la BBQ 3", "Con salsa barbacoa y cheddar.", 280, papasCategory, [], true, 11, undefined, new Image(27, "papas_bbq3.jpg", fritasImg)),
  new Product(28, "Papas a la BBQ 4", "Con salsa barbacoa y cheddar.", 280, papasCategory, [], true, 12, undefined, new Image(28, "papas_bbq4.jpg", fritasImg)),
  new Product(29, "Papas a la BBQ 5", "Con salsa barbacoa y cheddar.", 280, papasCategory, [], true, 13, undefined, new Image(29, "papas_bbq5.jpg", fritasImg)),
];
