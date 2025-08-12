const app = require("./app");
const { sequelize, User, Store } = require("./models");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 5000;

const seed = async () => {
  // seed admin if not exists
  const adminEmail = "admin@example.com";
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hash = await bcrypt.hash("Admin@1234", 10);
    admin = await User.create({ name: "System Administrator ExampleName", email: adminEmail, address: "HQ", passwordHash: hash, role: "admin" });
    console.log("Seeded admin user admin@example.com / Admin@1234");
  }

  // seed a store owner
  const ownerEmail = "owner@example.com";
  let owner = await User.findOne({ where: { email: ownerEmail } });
  if (!owner) {
    const hash = await bcrypt.hash("Owner@1234", 10);
    owner = await User.create({ name: "Store Owner ExampleName Long", email: ownerEmail, address: "Owner Address", passwordHash: hash, role: "owner" });
    console.log("Seeded owner owner@example.com / Owner@1234");
  }

  // seed some stores
  const cnt = await Store.count();
  if (cnt === 0) {
    await Store.create({ name: "Corner Cafe", email: "cafe@x.com", address: "12 Market Road", ownerId: owner.id });
    await Store.create({ name: "Tech Store Central", email: "tech@x.com", address: "99 Tech Park", ownerId: owner.id });
    console.log("Seeded sample stores");
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // keep simple for dev
    console.log("DB connected & synced");
    await seed();
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
