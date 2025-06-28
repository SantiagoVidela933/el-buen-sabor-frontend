import { useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  setValue: (query: string) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, setValue, onSearch }) => {
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [value, onSearch]);

  return (
    <div className={styles.search_wrapper} onSubmit={(e) => e.preventDefault()}>
      <form className={styles.search_form}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar productos..."
        />
        <span className="material-symbols-outlined">search</span>
      </form>
    </div>
  );
};

export default SearchBar;
