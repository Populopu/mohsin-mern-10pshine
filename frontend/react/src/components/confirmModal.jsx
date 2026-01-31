import "../styles/confirmModal.css";

const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
