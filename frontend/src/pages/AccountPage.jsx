import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePassword } from "../features/authSlice";

export default function AccountPage(){
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const submit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) return alert("Password must be 8-16 chars");
    await dispatch(updatePassword({ password }));
    alert("Password updated");
    setPassword("");
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Account</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid gap-3">
        <input type="password" className="border p-2 rounded" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded">Update Password</button>
      </form>
    </div>
  );
}


