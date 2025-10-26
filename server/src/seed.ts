import User from "./models/User";
import VacationRequest from "./models/VacationRequest";
import { sequelize } from "./config/db";

export const seedDatabase = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.findAll();
    
    if (existingUsers.length === 0) {
      // Create seed data only if users don't exist
      await User.bulkCreate([
        { name: "Alice", role: "Requester" },
        { name: "Bob", role: "Validator" },
      ]);
      console.log("✅ Seed complete: Created 2 users");
    } else {
      console.log(`ℹ️  Users already exist (${existingUsers.length} users), skipping seed`);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

// If run directly as a script
if (require.main === module) {
  (async () => {
    await sequelize.sync({ alter: true });
    await seedDatabase();
    process.exit(0);
  })();
}