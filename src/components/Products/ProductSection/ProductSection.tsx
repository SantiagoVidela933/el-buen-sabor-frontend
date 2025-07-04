import { useEffect, useState } from 'react';
import Category from '../../LandingPage/Category/Category';
import ProductList from '../ProductList/ProductList';
import Modal from '../../ui/Modal/Modal';
import ProductDetail from '../ProductDetail/ProductDetail';
import SearchBar from '../../LandingPage/SearchBar/SearchBar';

import { ArticuloVenta } from '../../../models/ArticuloVenta';
import { CategoriaArticulo } from '../../../models/CategoriaArticulo';

import { getArticulosByTipo } from '../../../api/articuloVenta';
import { getCategoriasMenuBySucursalId } from '../../../api/articuloCategoria';

const ProductSection = () => {
  const [articulos, setArticulos] = useState<ArticuloVenta[]>([]);
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0); 
  const [selectedProduct, setSelectedProduct] = useState<ArticuloVenta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const idSucursal = 1; 
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const [insumos, manufacturados] = await Promise.all([
          getArticulosByTipo(idSucursal, 'insumo'),
          getArticulosByTipo(idSucursal, 'manufacturado'),
        ]);
        const articulosCombinados =[...insumos, ...manufacturados];
        setArticulos(articulosCombinados);
      } catch (error) {
        console.error('Error cargando artículos:', error);
      }
    };
    fetchArticulos();
  }, []);

  useEffect(() => {
    getCategoriasMenuBySucursalId(idSucursal)
      .then(data => {
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

  const handleProductClick = (product: ArticuloVenta) => {
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

  const filteredProducts = articulos.filter((product) => {
    const categoriaId = product.categoriaArticulo?.id ?? 0;
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
        articuloVenta={filteredProducts}
        onProductClick={handleProductClick}
      />

      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <ProductDetail articuloVenta={selectedProduct} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProductSection;
