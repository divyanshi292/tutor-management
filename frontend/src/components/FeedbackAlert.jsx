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
          ? "rgba(34, 197, 94, 0.15)"
          : "rgba(239, 68, 68, 0.15)",
        border: `1px solid ${isSuccess ? "#86efac" : "#fca5a5"}`,
        color: isSuccess ? "#166534" : "#991b1b",
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
