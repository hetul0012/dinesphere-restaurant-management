import { useEffect, useState } from "react";
import { reservationAPI } from "../lib/api";

export default function MyReservations(){
  const [rows, setRows] = useState([]);
  const load = async()=> setRows(await reservationAPI.mine());
  useEffect(()=>{ load(); }, []);

  const cancel = async (r)=>{ await reservationAPI.remove(r.id || r._id); load(); };

  return (
    <section className="section">
      <div className="container">
        <h2>My Reservations</h2>
        <div className="table compact">
          <div className="thead">
            <div>Date & Time</div><div>Guests</div><div>Table</div><div>Status</div>
          </div>
          {rows.map(r=>(
            <div className="tr" key={r.id || r._id}>
              <div>{r.date} {r.time}</div>
              <div>{r.guests}</div>
              <div>{r.table}</div>
              <div className="row gap">
                <span className={`chip ${r.status==='pending'?'pending':'confirmed'}`}>{r.status}</span>
                {r.status !== "confirmed" && (
                  <button className="btn" onClick={()=>cancel(r)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
          {!rows.length && <div className="tr"><div>No reservations yet.</div></div>}
        </div>
      </div>
    </section>
  );
}
