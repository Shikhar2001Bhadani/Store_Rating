import React, { useEffect, useState } from "react";
import { FaPlus, FaUserPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import api from "../api/axiosInstance";


export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", address: "", ownerId: "" });
    const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
    const [submitting, setSubmitting] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", address: "", password: "", role: "user" });

    useEffect(() => {
        // simple: fetch lists and compute
        api.get("/users", { params: { pageSize: 100 } }).then(r => { setUsers(r.data.users || []); setStats(s => ({ ...s, users: r.data.total || (r.data.users?.length || 0) })); });
        api.get("/stores", { params: { pageSize: 100 } }).then(r => { setStores(r.data.stores || []); setStats(s => ({ ...s, stores: r.data.total || (r.data.stores?.length || 0) })); });
        api.get("/ratings/stats/total").then(r => setStats(s => ({ ...s, ratings: r.data.total || 0 }))).catch(() => { });
    }, []);

    const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "" });
    const [userSort, setUserSort] = useState({ sortField: "name", sortOrder: "ASC" });
    const [storeFilters, setStoreFilters] = useState({ name: "", email: "", address: "" });
    const [storeSort, setStoreSort] = useState({ sortField: "name", sortOrder: "ASC" });

    useEffect(() => {
        api.get("/users", { params: { pageSize: 100, ...userFilters, ...userSort } }).then(r => setUsers(r.data.users || []));
    }, [userFilters, userSort]);
    useEffect(() => {
        api.get("/stores", { params: { pageSize: 100, ...storeFilters, ...storeSort } }).then(r => setStores(r.data.stores || []));
    }, [storeFilters, storeSort]);

    const refreshStores = async () => {
        const r = await api.get("/stores", { params: { pageSize: 100 } });
        setStores(r.data.stores || []);
        setStats(s => ({ ...s, stores: r.data.stores?.length || 0 }));
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Store name is required");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/stores", {
                name: form.name.trim(),
                email: form.email.trim() || null,
                address: form.address.trim() || null,
                ownerId: form.ownerId ? Number(form.ownerId) : null
            });
            setForm({ name: "", email: "", address: "", ownerId: "" });
            await refreshStores();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to add store";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (store) => {
        setEditingId(store.id);
        setEditForm({
            name: store.name || "",
            email: store.email || "",
            address: store.address || "",
            ownerId: store.ownerId || ""
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", email: "", address: "", ownerId: "" });
    };

    const handleUpdateStore = async (id) => {
        try {
            await api.put(`/stores/${id}`, {
                name: editForm.name.trim(),
                email: editForm.email.trim() || null,
                address: editForm.address.trim() || null,
                ownerId: editForm.ownerId ? Number(editForm.ownerId) : null
            });
            cancelEdit();
            await refreshStores();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update store";
            alert(msg);
        }
    };

    const handleDeleteStore = async (id) => {
        const confirmed = window.confirm("Delete this store? This cannot be undone.");
        if (!confirmed) return;
        try {
            await api.delete(`/stores/${id}`);
            await refreshStores();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to delete store";
            alert(msg);
        }
    };

    const handleDeleteUser = async (id) => {
        const confirmed = window.confirm("Delete this user? This cannot be undone.");
        if (!confirmed) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            setStats(s => ({ ...s, users: Math.max(0, (s.users || 1) - 1) }));
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to delete user";
            alert(msg);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl mb-4">Admin Dashboard</h1>
        
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">Users: {stats.users}</div>
                <div className="bg-white p-4 rounded shadow">Stores: {stats.stores}</div>
                <div className="bg-white p-4 rounded shadow">Ratings: {stats.ratings}</div>
            </div>

            <div className="mt-6">
                    <h2 className="text-lg mb-2 flex items-center gap-2"><FaUserPlus /> Add User</h2>
                <form onSubmit={async (e)=>{e.preventDefault(); try { await api.post('/users', newUser); setNewUser({ name: "", email: "", address: "", password: "", role: "user" }); const r = await api.get('/users', { params: { pageSize: 100 } }); setUsers(r.data.users || []); } catch(err){ alert(err?.response?.data?.message || 'Failed to add user'); } }} className="bg-white p-4 rounded shadow grid gap-3">
                    <input className="border p-2 rounded" placeholder="Name (20-60)" value={newUser.name} onChange={e=>setNewUser(u=>({...u,name:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Email" value={newUser.email} onChange={e=>setNewUser(u=>({...u,email:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Address" value={newUser.address} onChange={e=>setNewUser(u=>({...u,address:e.target.value}))} />
                    <input className="border p-2 rounded" type="password" placeholder="Password (8-16, upper+special)" value={newUser.password} onChange={e=>setNewUser(u=>({...u,password:e.target.value}))} />
                    <select className="border p-2 rounded" value={newUser.role} onChange={e=>setNewUser(u=>({...u,role:e.target.value}))}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                    </select>
                    <button className="bg-green-600 text-white px-4 py-2 rounded w-max flex items-center gap-2"><FaUserPlus /> Add User</button>
                </form>
            </div>
            <div className="mt-6">
                    <h2 className="text-lg mb-2 flex items-center gap-2"><FaPlus /> Add Store</h2>
                <form onSubmit={handleAddStore} className="bg-white p-4 rounded shadow grid gap-3">
                    <input
                        className="border p-2 rounded"
                        placeholder="Name*"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Email (optional)"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Address (optional)"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Owner ID (optional)"
                        value={form.ownerId}
                        onChange={e => setForm(f => ({ ...f, ownerId: e.target.value }))}
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60 w-max"
                    >
                        {submitting ? "Adding..." : "Add Store"}
                    </button>
                </form>
            </div>

            <div className="mt-6">
                <h2 className="text-lg mb-2">Stores</h2>
                <div className="flex gap-2 mb-2 flex-wrap">
                    <input className="border p-2 rounded" placeholder="Name" value={storeFilters.name} onChange={e=>setStoreFilters(f=>({...f,name:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Email" value={storeFilters.email} onChange={e=>setStoreFilters(f=>({...f,email:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Address" value={storeFilters.address} onChange={e=>setStoreFilters(f=>({...f,address:e.target.value}))} />
                    <select className="border p-2 rounded" value={storeSort.sortField} onChange={e=>setStoreSort(s=>({...s,sortField:e.target.value}))}>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="averageRating">Rating</option>
                    </select>
                    <select className="border p-2 rounded" value={storeSort.sortOrder} onChange={e=>setStoreSort(s=>({...s,sortOrder:e.target.value}))}>
                        <option value="ASC">Asc</option>
                        <option value="DESC">Desc</option>
                    </select>
                </div>
                <div className="space-y-2">
                    {stores.map(s => (
                        <div key={s.id} className="bg-white p-3 rounded shadow">
                            {editingId === s.id ? (
                                <div className="grid gap-2">
                                    <input className="border p-2 rounded" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} />
                                    <input className="border p-2 rounded" value={editForm.email} onChange={e=>setEditForm(f=>({...f,email:e.target.value}))} />
                                    <input className="border p-2 rounded" value={editForm.address} onChange={e=>setEditForm(f=>({...f,address:e.target.value}))} />
                                    <input className="border p-2 rounded" value={editForm.ownerId} onChange={e=>setEditForm(f=>({...f,ownerId:e.target.value}))} />
                                    <div className="flex gap-2">
                                        <button onClick={()=>handleUpdateStore(s.id)} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"><FaSave /> Save</button>
                                        <button onClick={cancelEdit} className="border px-3 py-1 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">{s.name}</div>
                                        <div className="text-sm">{s.email}</div>
                                        <div className="text-sm">{s.address}</div>
                                        <div className="text-xs">Avg: {s.averageRating}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={()=>startEdit(s)} className="border px-3 py-1 rounded flex items-center gap-2"><FaEdit /> Edit</button>
                                        <button onClick={()=>handleDeleteStore(s.id)} className="text-red-600 border border-red-600 px-3 py-1 rounded flex items-center gap-2"><FaTrash /> Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-lg mb-2">Users</h2>
                <div className="flex gap-2 mb-2 flex-wrap">
                    <input className="border p-2 rounded" placeholder="Name" value={userFilters.name} onChange={e=>setUserFilters(f=>({...f,name:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Email" value={userFilters.email} onChange={e=>setUserFilters(f=>({...f,email:e.target.value}))} />
                    <input className="border p-2 rounded" placeholder="Address" value={userFilters.address} onChange={e=>setUserFilters(f=>({...f,address:e.target.value}))} />
                    <select className="border p-2 rounded" value={userFilters.role} onChange={e=>setUserFilters(f=>({...f,role:e.target.value}))}>
                        <option value="">Any Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                    </select>
                    <select className="border p-2 rounded" value={userSort.sortField} onChange={e=>setUserSort(s=>({...s,sortField:e.target.value}))}>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="address">Address</option>
                        <option value="role">Role</option>
                    </select>
                    <select className="border p-2 rounded" value={userSort.sortOrder} onChange={e=>setUserSort(s=>({...s,sortOrder:e.target.value}))}>
                        <option value="ASC">Asc</option>
                        <option value="DESC">Desc</option>
                    </select>
                </div>
                <div className="space-y-2">
                    {users.map(u => (
                        <div key={u.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                            <div>
                                <div className="font-semibold">{u.name}</div>
                                <div className="text-sm">{u.email}</div>
                                <div className="text-sm">{u.address}</div>
                                <div className="text-xs">Role: {u.role}</div>
                            </div>
                            <div className="flex gap-2">
                                <a href={`/users/${u.id}`} className="border px-3 py-1 rounded text-blue-600">Details</a>
                            <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 flex items-center gap-2"
                            >
                                <FaTrash /> Delete
                            </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
