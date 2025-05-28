import { useEffect, useState } from 'react';
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';
import Modal from '../../ui/Modal/Modal';
import ProductDetail from '../ProductDetail/ProductDetail';
import SearchBar from '../../LandingPage/SearchBar/SearchBar';

import { ArticuloManufacturado } from '../../../models/ArticuloManufacturado';
import { CategoriaArticulo } from '../../../models/CategoriaArticulo';

import { getAllArticulosManufacturados } from '../../../api/articuloManufacturado';
import { getCategoriasMenuBySucursalId } from '../../../api/articuloCategoria';

const ProductSection = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); // 0 para mostrar "Todas"
  const [selectedProduct, setSelectedProduct] = useState<ArticuloManufacturado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const idSucursal = 1; // Podés parametrizar esto si se elige sucursal en otra parte de tu app

  // Cargar productos manufacturados
  useEffect(() => {
    getAllArticulosManufacturados()
      .then(data => {
        console.log('Articulos cargados:', data);
        setArticulos(data);
      })
      .catch(error => {
        console.error('Error cargando artículos manufacturados:', error);
      });
  }, []);

  // Cargar categorías activas para la sucursal
  useEffect(() => {
    getCategoriasMenuBySucursalId(idSucursal)
      .then(data => {
        console.log('Categorías cargadas:', data);
        setCategorias(data);
      })
      .catch(error => {
        console.error('Error cargando categorías del menú:', error);
      });
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = articulos.filter((product) => {
    const categoriaId = product.categoria?.id ?? 0;
    const coincideCategoria = selectedCategory === 0 || categoriaId === selectedCategory;
    const coincideBusqueda = product.denominacion?.toLowerCase().includes(searchQuery);
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div>
      <Category
        categorias={categorias}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      <SearchBar
        value={searchQuery}
        setValue={setSearchQuery}
        onSearch={handleSearch}
      />

      <ProductList
        articulosManufacturados={filteredProducts}
        onProductClick={handleProductClick}
      />

      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <ProductDetail articuloManufacturado={selectedProduct} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProductSection;
