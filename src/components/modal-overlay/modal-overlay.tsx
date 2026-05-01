import styles from './modal-overlay.module.css';

type TModalOverlay = {
  onClose: () => void;
};

export function ModalOverlay({ onClose }: TModalOverlay): React.JSX.Element {
  function handleOverlay(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return <div className={styles.modal_overlay} onClick={handleOverlay}></div>;
}
