import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

//  Modal Component (Portal)
export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div>{children}</div>
        <button onClick={onClose} aria-label="Close Modal">
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}