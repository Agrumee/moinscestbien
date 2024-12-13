import Button from "../../atoms/Button/Button";
import "./Modal.scss";
import Paragraph from "../../atoms/Paragraph/Paragraph";

interface ModalProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Modal({ message, onCancel, onConfirm }: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <Paragraph content={message} className="modal-message"></Paragraph>
        <div className="modal-buttons">
          <Button variant="tertiary" size="tiny" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="secondary" size="tiny" onClick={onConfirm}>
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
