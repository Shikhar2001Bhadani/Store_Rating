const app = require("./app");
const { sequelize, User, Store } = require("./models");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 5000;

// Set up initial data for first-time setup
const seed = async () => {
  // Set up default admin account
  const adminEmail = "admin@example.com";
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hash = await bcrypt.hash("Admin@1234", 10);
    admin = await User.create({ name: "System Administrator ExampleName", email: adminEmail, address: "HQ", passwordHash: hash, role: "admin" });
    console.log("Seeded admin user admin@example.com / Admin@1234");
  }

  // Create sample store owner account
  const ownerEmail = "owner@example.com";
  let owner = await User.findOne({ where: { email: ownerEmail } });
  if (!owner) {
    // Hash the owner's password and create the owner account
    const hash = await bcrypt.hash("Owner@1234", 10);
    owner = await User.create({ name: "Store Owner ExampleName Long", email: ownerEmail, address: "Owner Address", passwordHash: hash, role: "owner" });
    console.log("Seeded owner owner@example.com / Owner@1234");
  }

  // Add example stores if database is empty
  const storeCount = await Store.count();
  if (storeCount === 0) {
    // Create two example stores with the owner's ID
    await Store.create({ name: "Corner Cafe", email: "cafe@x.com", address: "12 Market Road", ownerId: owner.id });
    await Store.create({ name: "Tech Store Central", email: "tech@x.com", address: "99 Tech Park", ownerId: owner.id });
    console.log("Seeded sample stores");
  }
};

// Initialize database and start server
(async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    // Auto-update database schema in development
    await sequelize.sync({ alter: true });
    console.log("Database connection successful");
    // Load initial data
    await seed();
    // Start the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
