import { Link } from "react-router-dom";

export function MenuCard({ item }) {
  const img =
    item?.image?.startsWith('http')
      ? item.image
      : item?.image
      ? `/images/${item.image}`
      : '/images/salmon.png';

  const id = item?.id || item?._id;

  return (
    <div className="card">
      <img src={img} alt={item?.name || 'Dish'} />
      <div className="pad">
        <div className="title-row">
          <h4>{item?.name}</h4>
          <div className="price">${Number(item?.price || 0).toFixed(2)}</div>
        </div>
        <div className="muted clamp-2">{item?.description}</div>
        <div style={{ marginTop: 10 }}>
          <Link to={`/menu/${id}`} className="btn ghost">View details</Link>
        </div>
      </div>
    </div>
  );
}
