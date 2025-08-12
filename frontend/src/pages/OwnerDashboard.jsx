import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function OwnerDashboard(){
  const [stores, setStores] = useState([]);
  useEffect(()=> {
    api.get("/stores/owner/me/ratings").then(r => setStores(r.data.stores || []));
  }, []);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Owner Dashboard</h1>
      {stores.map(s => (
        <div key={s.storeId} className="bg-white p-4 rounded shadow mb-3">
          <div className="font-semibold">{s.name}</div>
          <div>Average: {s.average}</div>
          <div className="mt-2">
            <div className="font-semibold">Ratings</div>
            {s.ratings.map(r => (
              <div key={r.id} className="text-sm">User: {r.user?.name} — {r.ratingValue}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
