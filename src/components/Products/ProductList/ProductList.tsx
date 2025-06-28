import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ArticuloVenta } from '../../../models/ArticuloVenta';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';
import { checkStoreStatus } from '../../../redux/slices/cartSlice';
import { AppDispatch } from '../../../redux/store';

interface ProductListProps {
  articuloVenta: ArticuloVenta[];
  onProductClick: (product: ArticuloVenta) => void;
}

const ProductList: React.FC<ProductListProps> = ({ articuloVenta, onProductClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Verificar estado de la tienda al cargar
  useEffect(() => {
    dispatch(checkStoreStatus());
  }, [dispatch]);
  
  
  return (
    <div className={styles.productList_wrapper}>
      {articuloVenta.map((articuloVenta) => (
        <ProductCard 
          key={articuloVenta.id} 
          product={articuloVenta} 
          onClick={() => onProductClick(articuloVenta)}
        />
      ))}
    </div>
  );
};

export default ProductList;
