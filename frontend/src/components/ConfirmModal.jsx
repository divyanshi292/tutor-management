import { useEffect } from "react";
import { FiAlertTriangle, FiInfo, FiTrash2, FiX } from "react-icons/fi";

function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const iconMap = {
    danger: <FiTrash2 size={24} />,
    warning: <FiAlertTriangle size={24} />,
    info: <FiInfo size={24} />,
  };

  const badgeClass =
    type === "danger"
      ? "modal-icon-badge danger"
      : type === "warning"
      ? "modal-icon-badge warning"
      : "modal-icon-badge info";

  const confirmBtnClass =
    type === "danger"
      ? "modal-confirm-btn danger"
      : type === "warning"
      ? "modal-confirm-btn warning"
      : "modal-confirm-btn info";

  return (
    <div
      className="aesthetic-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onCancel}
    >
      <div
        className="aesthetic-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          onClick={onCancel}
          aria-label="Close dialog"
        >
          <FiX />
        </button>

        <div className="modal-content-wrap">
          <div className={badgeClass} aria-hidden="true">
            {iconMap[type] || iconMap.danger}
          </div>

          <div className="modal-text-wrap">
            <h3 id="confirm-modal-title" className="modal-title">
              {title}
            </h3>
            <p className="modal-description">{message}</p>
          </div>
        </div>

        <div className="modal-actions-row">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={confirmBtnClass}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
