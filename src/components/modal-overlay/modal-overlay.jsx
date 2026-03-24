import styles from './modal-overlay.module.css';

export function ModalOverlay({ onClose }) {
  function handleOverlay(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return <div className={styles.modal_overlay} onClick={handleOverlay}></div>;
}
