export default function TableLegend() {
  return (
    <div className="legend">
      <span><span className="dot green" /> Available</span>
      <span><span className="dot orange" /> Reserved</span>
      <span><span className="dot red" /> Unavailable</span>
      <span><span className="dot gray" /> Selected</span>
    </div>
  );
}
