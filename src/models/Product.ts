export class Product {
    id: number;
    title: string;
    image: string;
    description: string;
    price: number;
    category: string;
  
    constructor(id: number, title: string, image: string, description: string, price: number, category: string) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
        this.category = category;
    }
  }
  