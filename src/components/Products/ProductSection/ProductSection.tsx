import { useState } from 'react';
import { products } from '../../../data/products'; 
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';

const ProductSection = () => {
  // categoria que se muestra al renderizar
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza'); 

  // actualiza categoria seleccionada
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); 
  };

  // filtra productos segun categoria elegida
  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  return (
    <div>
      <Category onCategoryChange={handleCategoryChange} />
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ProductSection;
