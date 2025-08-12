import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage(){
  const [form, setForm] = useState({ email:"", password:"" });
  const [mode, setMode] = useState("user"); // "admin" | "user"
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await dispatch(login(form)).unwrap();
      if (mode === "admin") {
        if (user?.role !== "admin") {
          alert("Please use an admin account to access the admin dashboard.");
          return;
        }
        nav("/admin");
        return;
      }
      // default user flow
      nav("/");
    } catch (err) { alert(err?.message || "Login failed"); }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode("user")}
          className={`px-3 py-1 rounded border ${mode === "user" ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
        >
          Login as User
        </button>
        <button
          type="button"
          onClick={() => setMode("admin")}
          className={`px-3 py-1 rounded border ${mode === "admin" ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
        >
          Login as Admin
        </button>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="border p-2 rounded"/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="border p-2 rounded"/>
        <button className="bg-blue-600 text-white px-3 py-2 rounded">{mode === "admin" ? "Login to Admin" : "Login"}</button>
      </form>
      <div className="mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-blue-600">Sign up</Link>
      </div>
    </div>
  );
}
