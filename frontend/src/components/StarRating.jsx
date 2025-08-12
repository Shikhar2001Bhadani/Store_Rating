import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ value = 0, max = 5, size = 14, className = "", color = "#F59E0B" }){
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const diff = value - (i - 1);
    if (diff >= 1) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (diff >= 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color={color} />);
    }
  }
  return <div className={`inline-flex items-center ${className}`}>{stars}</div>;
}


