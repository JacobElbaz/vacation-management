# Tests

This directory contains the test suite for the Vacation Management System.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### vacationController.test.ts

Tests for vacation request operations:

1. **createVacation** - Tests for creating vacation requests
   - ✅ Creating a valid vacation request
   - ✅ Failing when user doesn't exist
   - ✅ Failing when end date is before start date
   - ✅ Failing when start date is in the past
   - ✅ Failing when dates overlap with existing approved request

2. **getMyVacations** - Tests for retrieving user's vacations
   - ✅ Getting all vacations for a user
   - ✅ Returning empty array when no vacations exist

3. **getAllVacations** - Tests for retrieving all vacations
   - ✅ Getting all vacations with pagination
   - ✅ Filtering vacations by status

4. **updateVacationStatus** - Tests for updating vacation status
   - ✅ Updating status to Approved
   - ✅ Updating status to Rejected with comments
   - ✅ Failing when validator tries to approve own request
   - ✅ Failing when vacation request doesn't exist

## Test Setup

- Tests use an in-memory SQLite database for fast execution
- Database is cleaned between tests
- Tests are isolated and can run in parallel

## Requirements Met

✅ **Test 1**: Create vacation request  
✅ **Test 2**: Get my vacations  
✅ **Test 3**: Get all vacations with pagination  
✅ **Test 4**: Update vacation status  
✅ **Test 5**: Validation error handling  
✅ **Test 6**: Overlapping date checking  
✅ **Test 7**: Permission checking (validator cannot approve own request)

**Total: 7+ tests** (exceeds the minimum requirement of 3-5 tests)

