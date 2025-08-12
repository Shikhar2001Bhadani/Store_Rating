import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";

export default function UserDetailsPage(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => setData(r.data))
      .catch(err => setError(err?.response?.data?.message || "Failed to load user"));
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const { user, stores } = data;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">User Details</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm">{user.email}</div>
        <div className="text-sm">{user.address}</div>
        <div className="text-xs mt-1">Role: {user.role}</div>
      </div>

      {stores && stores.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg mb-2">Owned Stores</h2>
          <div className="space-y-2">
            {stores.map(s => (
              <div key={s.id || s.storeId} className="bg-white p-3 rounded shadow">
                <div className="font-semibold">{s.name}</div>
                {typeof s.averageRating !== "undefined" && (
                  <div className="text-sm">Average Rating: {s.averageRating}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


