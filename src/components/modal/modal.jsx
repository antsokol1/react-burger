import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '@/components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

export function Modal({ children, title, onClose }) {
  const modalRoot = document.getElementById('react-modals');

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose}></ModalOverlay>
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <p className="text text_type_main-medium">{title}</p>
          <CloseIcon type="primary" onClick={onClose} className="close_button" />
        </div>
        {children}
      </div>
    </>,
    modalRoot
  );
}
