import { Product } from "../models/Products/Product";

export const products = [
  // 🍕 PIZZAS
  new Product(1, "Pizza Margherita", "/src/assets/images/pizza_example.jpg", "Pizza clásica con tomate, mozzarella y albahaca.", 500, "pizza"),
  new Product(2, "Pizza Pepperoni", "/src/assets/images/pizza_example.jpg", "Con pepperoni picante y queso fundido.", 650, "pizza"),
  new Product(3, "Pizza Napolitana", "/src/assets/images/pizza_example.jpg", "Mozzarella, tomate en rodajas y ajo.", 600, "pizza"),
  new Product(4, "Pizza Fugazzeta", "/src/assets/images/pizza_example.jpg", "Cebolla, mozzarella y orégano.", 550, "pizza"),
  new Product(5, "Pizza Cuatro Quesos", "/src/assets/images/pizza_example.jpg", "Mozzarella, azul, provolone y parmesano.", 700, "pizza"),

  // 🍔 HAMBURGUESAS
  new Product(6, "Hamburguesa Clásica", "/src/assets/images/burger_example.jpg", "Carne, lechuga, tomate y mayonesa.", 350, "burger"),
  new Product(7, "Hamburguesa con Cheddar", "/src/assets/images/burger_example.jpg", "Con doble cheddar fundido.", 400, "burger"),
  new Product(8, "Hamburguesa Doble Carne", "/src/assets/images/burger_example.jpg", "Doble medallón, panceta y cheddar.", 550, "burger"),
  new Product(9, "Hamburguesa BBQ", "/src/assets/images/burger_example.jpg", "Salsa barbacoa, cebolla crispy y cheddar.", 480, "burger"),
  new Product(10, "Hamburguesa Vegana", "/src/assets/images/burger_example.jpg", "Medallón vegetal, lechuga, tomate y aderezo vegano.", 420, "burger"),

  // 🌭 PANCHOS
  new Product(11, "Pancho Clásico", "/src/assets/images/pancho_example.jpg", "Con ketchup y mostaza.", 120, "panchos"),
  new Product(12, "Pancho con Cheddar", "/src/assets/images/pancho_example.jpg", "Baño de cheddar fundido.", 180, "panchos"),
  new Product(13, "Pancho con Bacon", "/src/assets/images/pancho_example.jpg", "Trozos de panceta y salsa cheddar.", 200, "panchos"),
  new Product(14, "Pancho Picante", "/src/assets/images/pancho_example.jpg", "Salsa picante y jalapeños.", 190, "panchos"),
  new Product(15, "Pancho Completo", "/src/assets/images/pancho_example.jpg", "Con papas pay, mayonesa y ketchup.", 160, "panchos"),

  // 🥤 BEBIDAS
  new Product(16, "Coca-Cola", "/src/assets/images/bebida_example.jpg", "Botella 500ml.", 80, "bebida"),
  new Product(17, "Agua Mineral", "/src/assets/images/bebida_example.jpg", "Botella sin gas, 500ml.", 60, "bebida"),
  new Product(18, "Sprite", "/src/assets/images/bebida_example.jpg", "Refresco lima-limón, 500ml.", 80, "bebida"),
  new Product(19, "Fanta", "/src/assets/images/bebida_example.jpg", "Refresco sabor naranja, 500ml.", 80, "bebida"),
  new Product(20, "Jugo de Naranja", "/src/assets/images/bebida_example.jpg", "Jugo natural exprimido, 350ml.", 100, "bebida"),

  // 🍟 PAPAS
  new Product(21, "Papas Clásicas", "/src/assets/images/fritas_example.jpg", "Papas crujientes con sal.", 150, "papas"),
  new Product(22, "Papas con Cheddar", "/src/assets/images/fritas_example.jpg", "Con abundante cheddar derretido.", 250, "papas"),
  new Product(23, "Papas con Cheddar y Bacon", "/src/assets/images/fritas_example.jpg", "Con cheddar y panceta crocante.", 300, "papas"),
  new Product(24, "Papas Provenzal", "/src/assets/images/fritas_example.jpg", "Con ajo, perejil y manteca.", 200, "papas"),
  new Product(25, "Papas a la BBQ 1", "/src/assets/images/fritas_example.jpg", "Con salsa barbacoa y cheddar.", 280, "papas"),
  new Product(26, "Papas a la BBQ 2", "/src/assets/images/fritas_example.jpg", "Con salsa barbacoa y cheddar.", 280, "papas"),
  new Product(27, "Papas a la BBQ 3", "/src/assets/images/fritas_example.jpg", "Con salsa barbacoa y cheddar.", 280, "papas"),
  new Product(28, "Papas a la BBQ 4", "/src/assets/images/fritas_example.jpg", "Con salsa barbacoa y cheddar.", 280, "papas"),
  new Product(29, "Papas a la BBQ 5", "/src/assets/images/fritas_example.jpg", "Con salsa barbacoa y cheddar.", 280, "papas"),
];
