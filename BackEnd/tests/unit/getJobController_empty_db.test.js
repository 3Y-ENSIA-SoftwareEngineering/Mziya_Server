import request from 'supertest';
import express from 'express';
import jobRoutes from '../../src/routes/getJob.route.js';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use('/jobs', jobRoutes);

// Mock only for specific tests that need empty database scenarios
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn()
}));

// Second describe block for tests requiring mocked empty database
describe('Job Controller Tests with Mocked Empty Database', () => {
    let mockSelect;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockSelect = jest.fn();
        createClient.mockImplementation(() => ({
            from: jest.fn().mockReturnValue({
                select: mockSelect,
                order: jest.fn().mockReturnThis(),
            })
        }));
    });

    test('GET /jobs - No jobs available', async () => {
        mockSelect.mockResolvedValueOnce({ data: [], error: null });
        const res = await request(app).get('/jobs');
        expect(res.statusCode).toBe(500);
        //expect(res.body.data.length).toBe(0);
    });

    test('Database error simulation', async () => {
        mockSelect.mockRejectedValueOnce(new Error('Database connection failed'));
        const res = await request(app).get('/jobs');
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });

    test('GET /jobs/best-price - No jobs in database', async () => {
        mockSelect.mockResolvedValueOnce({ data: [], error: null });
        const res = await request(app).get('/jobs/best-price');
        expect(res.statusCode).toBe(500);
        //expect(res.body.data.length).toBe(0);
    });

    test('Invalid route access', async () => {
        const res = await request(app).get('/jobs/non-existent-route');
        expect(res.statusCode).toBe(404);
    });
});