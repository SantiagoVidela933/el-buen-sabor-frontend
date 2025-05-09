import { useState } from 'react';
import { products } from '../../../data/products'; 
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';
import { Product } from '../../../models/Product';
import Modal from '../../ui/Modal/Modal';
import ProductDetail from '../ProductDetail/ProductDetail';
import SearchBar from '../../LandingPage/SearchBar/SearchBar';

const ProductSection = () => {
  // categoria que se muestra al renderizar
  const [selectedCategory, setSelectedCategory] = useState<string>('pizza'); 

  // producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // estado busqueda
  const [searchQuery, setSearchQuery] = useState('');

  // actualiza categoria seleccionada
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); 
    setSearchQuery('');
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
  const filteredProducts = products.filter(
    (product) =>
      product.category === selectedCategory &&
      product.title.toLowerCase().includes(searchQuery)
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <div>
      <Category onCategoryChange={handleCategoryChange} />

      <SearchBar
        value={searchQuery}
        setValue={setSearchQuery}
        onSearch={handleSearch}
      />

      <ProductList products={filteredProducts} onProductClick={handleProductClick}/>

      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <ProductDetail product={selectedProduct} />
        </Modal>
      )}
    </div>
  );
};

export default ProductSection;
