import { useEffect, useState } from 'react';
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';
import Modal from '../../ui/Modal/Modal';
import ProductDetail from '../ProductDetail/ProductDetail';
import SearchBar from '../../LandingPage/SearchBar/SearchBar';
import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import { getAllArticulosManufacturados } from '../../../api/articuloManufacturado';

const ProductSection = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // o null si querés sin filtro por defecto
  const [selectedProduct, setSelectedProduct] = useState<ArticuloManufacturado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: number) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleProductClick = (product: ArticuloManufacturado) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllArticulosManufacturados()
      .then(data => {
        // console.log('Articulos cargados:', data);
        setArticulos(data);
      })
      .catch(error => {
        console.error('Error cargando artículos manufacturados:', error);
      });
  }, []);

  const filteredProducts = articulos.filter((product) => {
    const categoriaId = product.categoria?.id ?? 0;
    return (
      categoriaId === selectedCategory &&
      product.denominacion?.toLowerCase().includes(searchQuery)
    );
  });


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

      <ProductList articulosManufacturados={filteredProducts} onProductClick={handleProductClick} />

      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <ProductDetail articuloManufacturado={selectedProduct} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProductSection;
