import React from 'react';
import { Product } from '../../../models/Product';

interface ProductCardProps {
  product: Product;
}

// componente propio de cada producto
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div>
      <img src={product.image} alt={product.title} style={{width: 200}} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
};

export default ProductCard;
