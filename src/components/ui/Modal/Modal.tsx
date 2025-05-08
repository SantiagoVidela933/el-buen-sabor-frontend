import { ReactNode, useEffect } from "react";
import styles from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({onClose, children}: ModalProps) => {

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }, [onClose]);
      
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Evita que cierre si se clickea dentro
      >
        <button className={styles.closeButton} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
