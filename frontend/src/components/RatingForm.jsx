import React, { useEffect, useState } from "react";
import { submitRating, getUserRating } from "../features/ratingSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaPaperPlane } from "react-icons/fa";

export default function RatingForm({ storeId }){
  const dispatch = useDispatch();
  const userRating = useSelector(s => s.ratings.current);
  const user = useSelector(s => s.auth.user);
  const [val, setVal] = useState(userRating?.ratingValue || 0);
  const nav = useNavigate();
  const [comment, setComment] = useState("");

  useEffect(()=> {
    if (user) {
      dispatch(getUserRating(storeId));
    }
  }, [dispatch, storeId, user]);

  useEffect(()=> { if (userRating) setVal(userRating.ratingValue); }, [userRating]);

  const handleSubmit = async () => {
    if (!val || val < 1 || val > 5) return alert("Rating 1-5");
    await dispatch(submitRating({ storeId, ratingValue: +val, comment: comment?.trim() || undefined }));
    alert("Submitted");
    nav("/");
  };

  if (!user) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="mb-2">Please log in to rate this store.</div>
        <Link to="/login" className="text-blue-600">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="mb-2 flex items-center gap-2">Your rating: {val} <FaStar className="text-yellow-500"/></div>
      <input type="range" min="1" max="5" value={val} onChange={e=>setVal(e.target.value)} />
      <textarea
        className="border p-2 rounded w-full mt-3"
        placeholder="Optional comments about your experience"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
      />
      <div className="mt-2">
        <button onClick={handleSubmit} className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"><FaPaperPlane /> Submit</button>
      </div>
    </div>
  );
}
