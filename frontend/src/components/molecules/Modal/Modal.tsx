import Button from "../../atoms/Button/Button";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Input from "../../atoms/Input/Input";
import "./Modal.scss";

interface ModalProps {
  message: string;
  input?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Modal({ message, input, handleChange, onCancel, onConfirm }: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <Paragraph content={message} className="modal-message"></Paragraph>
        {input ? <Input className="large-input"
          placeholder="exemple@exemple.com"
          value={input}
          onChange={handleChange} /> : null}
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
