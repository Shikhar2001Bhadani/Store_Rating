import React from "react";
import { FaStore, FaSignOutAlt, FaUserCircle, FaTools } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const doLogout = async () => { await dispatch(logout()); nav("/login"); };
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <div className="font-bold flex items-center gap-2"><FaStore /> Store Ratings</div>
      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span className="text-sm flex items-center gap-1"><FaUserCircle /> {user.name.split(" ")[0]}</span>
            <Link to="/account" className="text-blue-600 flex items-center gap-1"><FaUserCircle /> Account</Link>
            {user.role === 'admin' && <Link to="/admin" className="text-blue-600 flex items-center gap-1"><FaTools /> Admin</Link>}
            {user.role === 'owner' && <Link to="/owner" className="text-blue-600 flex items-center gap-1"><FaTools /> Owner</Link>}
            <button className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1" onClick={doLogout}><FaSignOutAlt /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
