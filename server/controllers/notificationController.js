const Notification = require("../models/Notification");

exports.createNotification = async (userId, message) => {
  await Notification.create({ userId, message });
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id, isRead: false },
    order: [["createdAt", "DESC"]],
  });

  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  await Notification.update(
    { isRead: true },
    { where: { userId: req.user.id } }
  );

  res.json({ message: "Notifications marked as read" });
};
