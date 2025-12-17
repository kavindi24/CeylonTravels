import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaTrash, FaCheckCircle } from "react-icons/fa";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mark as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  // 🔹 Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <div className="text-center mt-5">Loading notifications...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <FaBell className="me-2 text-primary" size={22} />
        <h4 className="mb-0">Notifications</h4>
        {unreadCount > 0 && (
          <span className="badge bg-danger ms-2">{unreadCount} New</span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="alert alert-info">
          No notifications available
        </div>
      ) : (
        <div className="list-group">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`list-group-item list-group-item-action mb-2 rounded shadow-sm ${
                n.isRead ? "bg-light" : "border-start border-4 border-primary"
              }`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{n.title}</h6>
                  <p className="mb-1 text-muted">{n.message}</p>
                  <small className="text-secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>

                <div className="d-flex gap-2">
                  {!n.isRead && (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => markAsRead(n._id)}
                      title="Mark as read"
                    >
                      <FaCheckCircle />
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteNotification(n._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
