function FeedbackAlert({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      style={{
        padding: "12px 18px",
        borderRadius: "12px",
        marginBottom: "20px",
        background: isSuccess
          ? "rgba(16, 185, 129, 0.12)"
          : "rgba(244, 63, 94, 0.12)",
        border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecdd3"}`,
        color: isSuccess ? "#065f46" : "#be123c",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            color: "inherit",
            padding: "0 4px",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default FeedbackAlert;
