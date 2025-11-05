import { useEffect, useState } from "react";
import { menuAPI, reservationsAPI } from "../lib/api";

export default function ClientDashboard(){
  const [stats, setStats] = useState({ upcoming:0, favorites:7, lastVisit:'Dec 15, 2024' });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    (async () => {
      const mine = await reservationsAPI.mine();
      setStats(s => ({...s, upcoming: mine?.length || 0}));
      const feats = await menuAPI.list({ featured:true });
      setFeatured(feats || []);
    })();
  }, []);

  return (
    <>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px'}}>
        <div className="panel"><strong>Upcoming Reservations</strong><div style={{fontSize:'28px', fontWeight:800, marginTop:'6px'}}>{stats.upcoming}</div></div>
        <div className="panel"><strong>Favorite Dishes</strong><div style={{fontSize:'28px', fontWeight:800, marginTop:'6px'}}>{stats.favorites}</div></div>
        <div className="panel"><strong>Last Visit</strong><div className="muted" style={{marginTop:'6px'}}>{stats.lastVisit}</div></div>
      </div>

      <div className="panel" style={{marginTop:'14px'}}>
        <strong>Featured Dishes</strong>
        <div className="grid" style={{marginTop:'12px'}}>
          {featured.map((f) => (
            <div key={f.id || f._id} className="card">
              <img src={f.image || '/images/salmon.png'} />
              <div className="pad">
                <div style={{fontWeight:700}}>{f.name}</div>
                <div className="muted">${f.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
