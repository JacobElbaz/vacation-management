import { Request, Response, NextFunction } from 'express';
import { createVacation, getMyVacations, getAllVacations, updateVacationStatus } from '../controllers/vacationController';
import User from '../models/User';
import VacationRequest from '../models/VacationRequest';
import { testUserIds, testVacationIds } from './setup';

describe('Vacation Controller', () => {
  let testUser: any;
  let testValidator: any;

  beforeEach(async () => {
    // Create test users
    testUser = await User.create({
      name: 'Test User',
      role: 'Requester'
    });
    testUserIds.push(testUser.id);

    testValidator = await User.create({
      name: 'Test Validator',
      role: 'Validator'
    });
    testUserIds.push(testValidator.id);
  });

  describe('createVacation', () => {
    it('should create a vacation request successfully', async () => {
      const req: any = {
        body: {
          user_id: testUser.id,
          start_date: '2025-12-01',
          end_date: '2025-12-05',
          reason: 'Vacation test'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await createVacation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const returnedData = res.json.mock.calls[0][0];
      expect(returnedData.success).toBe(true);
      expect(returnedData.data.user_id).toBe(testUser.id);
      
      // Track vacation ID for cleanup
      const vacationData = returnedData.data as any;
      testVacationIds.push(vacationData.id);
    });

    it('should fail when user does not exist', async () => {
      const req: any = {
        body: {
          user_id: 999999,
          start_date: '2025-12-01',
          end_date: '2025-12-05',
          reason: 'Vacation test'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await createVacation(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });

    it('should fail when end date is before start date', async () => {
      const req: any = {
        body: {
          user_id: testUser.id,
          start_date: '2025-12-05',
          end_date: '2025-12-01',
          reason: 'Invalid dates'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await createVacation(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('End date must be after start date');
    });

    it('should fail when start date is in the past', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const req: any = {
        body: {
          user_id: testUser.id,
          start_date: yesterdayStr,
          end_date: '2025-12-05',
          reason: 'Past date'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await createVacation(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Start date cannot be in the past');
    });

    it('should fail when dates overlap with existing approved request', async () => {
      // Create an existing approved vacation
      const existing = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-10',
        end_date: '2025-12-15',
        status: 'Approved'
      });
      testVacationIds.push(existing.get({ plain: true }).id);

      const req: any = {
        body: {
          user_id: testUser.id,
          start_date: '2025-12-12',
          end_date: '2025-12-20',
          reason: 'Overlapping'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await createVacation(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(409);
    });
  });

  describe('getMyVacations', () => {
    it('should get all vacations for a user', async () => {
      // Create some vacation requests
      const vac1 = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        reason: 'First vacation'
      });
      testVacationIds.push(vac1.get({ plain: true }).id);

      const vac2 = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-20',
        end_date: '2025-12-25',
        reason: 'Second vacation'
      });
      testVacationIds.push(vac2.get({ plain: true }).id);

      const req: any = {
        query: { userId: testUser.id }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await getMyVacations(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: testUser.id,
            reason: 'First vacation'
          }),
          expect.objectContaining({
            user_id: testUser.id,
            reason: 'Second vacation'
          })
        ])
      );
    });

    it('should return empty array when user has no vacations', async () => {
      const req: any = {
        query: { userId: testUser.id }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await getMyVacations(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getAllVacations', () => {
    it('should get all vacations with pagination', async () => {
      // Create test data
      const vac = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05'
      });
      testVacationIds.push(vac.get({ plain: true }).id);

      const req: any = {
        query: { page: 1, limit: 10 }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await getAllVacations(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          vacations: expect.any(Array),
          pagination: expect.objectContaining({
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            itemsPerPage: 10
          })
        })
      );
    });

    it('should filter vacations by status', async () => {
      const vac = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        status: 'Pending'
      });
      testVacationIds.push(vac.get({ plain: true }).id);

      const req: any = {
        query: { status: 'Pending' }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await getAllVacations(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.vacations.every((v: any) => v.status === 'Pending')).toBe(true);
    });
  });

  describe('updateVacationStatus', () => {
    it('should update vacation status to Approved', async () => {
      const vacation = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        status: 'Pending'
      });

      const vacationData = vacation.get({ plain: true }) as any;
      testVacationIds.push(vacationData.id);

      const req: any = {
        params: { id: vacationData.id },
        body: {
          status: 'Approved',
          validatorId: testValidator.id
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await updateVacationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vacation request updated successfully'
      });

      // Verify the status was updated in the database
      const updated = await VacationRequest.findByPk(vacationData.id);
      const updatedData = updated?.get({ plain: true }) as any;
      expect(updatedData?.status).toBe('Approved');
    });

    it('should update vacation status to Rejected with comments', async () => {
      const vacation = await VacationRequest.create({
        user_id: testUser.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        status: 'Pending'
      });

      const vacationData = vacation.get({ plain: true }) as any;
      testVacationIds.push(vacationData.id);

      const req: any = {
        params: { id: vacationData.id },
        body: {
          status: 'Rejected',
          validatorId: testValidator.id,
          comments: 'Not enough coverage'
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await updateVacationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);

      // Verify the status and comments were updated
      const updated = await VacationRequest.findByPk(vacationData.id);
      const updatedData = updated?.get({ plain: true }) as any;
      expect(updatedData?.status).toBe('Rejected');
      expect(updatedData?.comments).toBe('Not enough coverage');
    });

    it('should fail when validators try to approve their own request', async () => {
      // Create a request by the validator
      const vacation = await VacationRequest.create({
        user_id: testValidator.id,
        start_date: '2025-12-01',
        end_date: '2025-12-05',
        status: 'Pending'
      });

      const vacationData = vacation.get({ plain: true }) as any;
      testVacationIds.push(vacationData.id);

      const req: any = {
        params: { id: vacationData.id },
        body: {
          status: 'Approved',
          validatorId: testValidator.id // trying to approve own request
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await updateVacationStatus(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Validators cannot approve or reject their own vacation requests');
    });

    it('should fail when vacation request does not exist', async () => {
      const req: any = {
        params: { id: 999999 },
        body: {
          status: 'Approved',
          validatorId: testValidator.id
        }
      };

      const res: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const next = jest.fn();

      await updateVacationStatus(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Vacation request not found');
    });
  });
});

