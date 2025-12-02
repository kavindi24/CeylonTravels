const sequelize = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  await sequelize.sync();

  const existing = await Admin.findOne({ where: { email: 'admin@ceylontravels.com' } });
  if (existing) return console.log('❌ Admin already exists');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.create({
    fullName: 'Super Admin',
    email: 'admin@ceylontravels.com',
    password: hashedPassword,
  });

  console.log('✅ Admin created: admin@ceylontravels.com / admin123');
  process.exit();
};

createAdmin();