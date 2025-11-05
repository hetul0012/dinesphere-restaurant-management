import { useEffect, useState } from "react";
import { tablesAPI } from "../../lib/api";

export default function AdminTables(){
  const [rows, setRows] = useState([]);
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState(4);

  async function load(){
    const data = await tablesAPI.list();
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);

  async function create(e){
    e.preventDefault();
    const created = await tablesAPI.create({ code, capacity });
    setRows(r => [created, ...r]);
    setCode(""); setCapacity(4);
  }

  async function remove(id){
    await tablesAPI.remove(id);
    setRows(r => r.filter(x => (x.id||x._id)!==id));
  }

  return (
    <div className="section">
      <h1 className="section__title">Admin · Tables</h1>

      <div className="grid two">
        <form className="panel" onSubmit={create}>
          <h3>New Table</h3>
          <label>Code (e.g., T-1)<input value={code} onChange={e=>setCode(e.target.value)} /></label>
          <label>Capacity<input type="number" value={capacity} onChange={e=>setCapacity(+e.target.value)} /></label>
          <button className="btn mt">Create</button>
        </form>

        <div className="panel">
          <h3>All Tables</h3>
          <ul className="tile">
            {rows.map(t => {
              const id = t.id || t._id;
              return (
                <li key={id} className="row" style={{justifyContent:"space-between"}}>
                  <strong>{t.code}</strong> <span className="muted">{t.capacity} seats</span>
                  <button className="btn ghost" onClick={()=>remove(id)}>Delete</button>
                </li>
              );
            })}
            {rows.length===0 && <div className="muted">No tables yet.</div>}
          </ul>
        </div>
      </div>
    </div>
  );
}
