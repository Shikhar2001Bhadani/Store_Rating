import React from "react";
import StoreList from "../components/StoreList";

export default function HomePage(){
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Stores</h1>
      <StoreList />
    </div>
  );
}
