import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import StarRating from "../components/StarRating";
import RatingForm from "../components/RatingForm";

export default function StorePage(){
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(()=> {
    api.get(`/stores/${id}`).then(res => setStore(res.data));
  }, [id]);

  if (!store) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl">{store.store.name}</h2>
        <div className="text-sm">{store.store.address}</div>
        <div className="mt-2 flex items-center gap-2">
          <StarRating value={store.averageRating} />
          <span>Average Rating: {store.averageRating}</span>
        </div>
      </div>
      <div className="mt-4">
        <RatingForm storeId={+id} />
      </div>
    </div>
  );
}
