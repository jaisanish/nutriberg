export default function ProgressBar({ label, current, max, color = 'green', unit = '' }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-label">
        <span className="text-secondary">{label}</span>
        <span>
          <span className="font-semibold">{Math.round(current)}</span>
          <span className="text-muted"> / {max}{unit}</span>
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
