function StatCard({ title, value, color, icon, subtext }) {
  return (
    <div className="stat-card" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{title}</h3>
        {icon && (
          <span
            style={{
              fontSize: "20px",
              background: "rgba(212, 167, 44, 0.12)",
              padding: "6px 10px",
              borderRadius: "10px",
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <p style={color ? { color } : undefined}>{value}</p>
      {subtext && (
        <span
          style={{
            fontSize: "12px",
            color: "var(--butter-muted, #776846)",
            marginTop: "4px",
            display: "block",
          }}
        >
          {subtext}
        </span>
      )}
    </div>
  );
}

export default StatCard;
