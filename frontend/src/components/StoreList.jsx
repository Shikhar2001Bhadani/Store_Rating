import React, { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import StarRating from "./StarRating";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores } from "../features/storeSlice";
import { Link } from "react-router-dom";

export default function StoreList(){
  const dispatch = useDispatch();
  const { list } = useSelector(s => s.stores);
  const [q, setQ] = useState({ name: "", address: "" });

  useEffect(()=> { dispatch(fetchStores({ name: q.name, address: q.address })); }, [dispatch, q]);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <div className="flex items-center gap-2 border rounded p-2 w-full max-w-xs"><FaSearch /><input className="outline-none w-full" value={q.name} onChange={e=>setQ({...q,name:e.target.value})} placeholder="Search name" /></div>
        <div className="flex items-center gap-2 border rounded p-2 w-full max-w-xs"><FaMapMarkerAlt /><input className="outline-none w-full" value={q.address} onChange={e=>setQ({...q,address:e.target.value})} placeholder="Search address" /></div>
      </div>
      <div className="grid gap-4">
        {list.map(s => (
          <div key={s.id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm">{s.address}</div>
              <div className="text-xs flex items-center gap-2">
                <StarRating value={s.averageRating} />
                <span>Avg: {s.averageRating}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to={`/stores/${s.id}`} className="text-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
