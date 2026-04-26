import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '@/components/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';

import styles from './modal.module.css';

type TModalProps = {
  children: ReactNode;
  title?: string;
  onClose: () => void;
};

export function Modal({ children, title, onClose }: TModalProps): React.ReactNode {
  const modalRoot = document.getElementById('react-modals');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!modalRoot) {
    console.error('Элемент с id "react-modals" не найден');
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
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
