import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){
  const [form, setForm] = useState({ name:"", email:"", address:"", password:"" });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      nav("/");
    } catch (err) { alert(err?.message || "Register failed"); }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register as user</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input placeholder="Full name (20-60 chars)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="border p-2 rounded"/>
        <textarea placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="border p-2 rounded"/>
        <button className="bg-green-600 text-white px-3 py-2 rounded">Register</button>
      </form>
    </div>
  );
}
