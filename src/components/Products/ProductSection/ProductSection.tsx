import { useState } from 'react';
import { products } from '../../../data/products'; 
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';
import { Product } from '../../../models/Product';
import Modal from '../../ui/Modal/Modal';
import ProductDetail from '../ProductDetail/ProductDetail';

const ProductSection = () => {
  // categoria que se muestra al renderizar
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza'); 

  // producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // actualiza categoria seleccionada
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); 
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // filtra productos segun categoria elegida
  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  return (
    <div>
      <Category onCategoryChange={handleCategoryChange} />
      <ProductList products={filteredProducts} onProductClick={handleProductClick}/>

      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <ProductDetail product={selectedProduct} />
        </Modal>
      )

      }
    </div>
  );
};

export default ProductSection;
