import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe, 
  FaUserShield, 
  FaCalendarAlt, 
  FaEdit, 
  FaTrash 
} from "react-icons/fa";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admins/users");
        const data = res.data.map((user) => ({
          id: user.id,
          name: user.username,
          email: user.email,
          phone: user.phone || "-",
          country: user.country || "-",
          role: user.role,
          joined: new Date(user.createdAt).toLocaleDateString(),
        }));
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err.response || err);
        alert("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/admins/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Failed to delete user:", err.response || err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = async (id) => {
    const newName = window.prompt("Enter new username:");
    if (!newName) return;
    try {
      const res = await axios.put(`/api/admins/users/${id}`, { username: newName });
      setUsers(users.map((user) => (user.id === id ? { ...user, name: res.data.username } : user)));
      alert("User updated successfully.");
    } catch (err) {
      console.error("Failed to update user:", err.response || err);
      alert("Failed to update user.");
    }
  };

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || user.role === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container py-4">
      <h3 className="mb-4">Manage Users</h3>

      {/* Search + Filter */}
      <div className="d-flex justify-content-between mb-3 flex-wrap">
        <div className="input-group w-50 mb-2">
          <span className="input-group-text"><FaSearch /></span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center mb-2">
          <FaFilter className="me-2 mt-1" />
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th><FaUserShield /></th>
                  <th><FaUser /> Name</th>
                  <th><FaEnvelope /> Email</th>
                  <th><FaPhone /> Phone</th>
                  <th><FaGlobe /> Country</th>
                  <th><FaUserShield /> Role</th>
                  <th><FaCalendarAlt /> Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">No users found</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.country}</td>
                      <td>
                        <span className={`badge ${user.role === "admin" ? "bg-primary" : "bg-secondary"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.joined}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(user.id)}><FaEdit /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .search-input {
          border: 1px solid #ced4da !important;
          color: #000 !important;
        }
        .search-input:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default ManageUsers;
