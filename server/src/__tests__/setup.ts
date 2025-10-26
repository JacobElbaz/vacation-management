import { sequelize } from '../config/db';
import User from '../models/User';
import VacationRequest from '../models/VacationRequest';

// Track test data IDs to avoid deleting production data
const testUserIds: number[] = [];
const testVacationIds: number[] = [];

// Setup test database before all tests
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });
});

// Clean up after all tests - delete only test data
afterAll(async () => {
  try {
    // Delete only test vacations
    if (testVacationIds.length > 0) {
      await VacationRequest.destroy({ where: { id: testVacationIds } });
    }
    // Delete only test users
    if (testUserIds.length > 0) {
      await User.destroy({ where: { id: testUserIds } });
    }
  } catch (error) {
    // Ignore cleanup errors
  }
});

// Do NOT clean up between tests - this prevents deleting production data
// Each test should manage its own cleanup if needed

export { testUserIds, testVacationIds };

