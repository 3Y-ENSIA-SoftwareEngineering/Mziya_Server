// tests/jobController.test.js
import request from 'supertest';
import express from 'express';
import jobRoutes from '../../src/routes/getJob.route.js';




const app = express();
app.use(express.json());
app.use('/jobs', jobRoutes);

describe('Job Controller Comprehensive Tests', () => {

    test('GET /jobs - Fetch all jobs (success case)', async () => {
        const res = await request(app).get('/jobs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // test('GET /jobs - No jobs available', async () => {
    //     // Mock supabase response to return no jobs
    //     // (if needed, adjust setup to simulate empty DB)
    //     const res = await request(app).get('/jobs');
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.data.length).toBe(0);
    // });

    test('GET /jobs/category/:category - Fetch jobs by valid category', async () => {
        const category = 'Painting'; 
        const res = await request(app).get(`/jobs/category/${category}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('category', category);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /jobs/category/:category - Category not found', async () => {
        const invalidCategory = 'NonExistentCategory';
        const res = await request(app).get(`/jobs/category/${invalidCategory}`);
        expect(res.statusCode).toBe(500);
        //expect(res.body.data.length).toBe(0);
    });

    test('GET /jobs/category/:category - Missing category parameter', async () => {
        const res = await request(app).get('/jobs/category/');
        expect(res.statusCode).toBe(404);  // Express default behavior for missing routes
    });

    test('GET /jobs/best-price - Fetch jobs sorted by price', async () => {
        const res = await request(app).get('/jobs/best-price');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('description', 'Jobs sorted from highest to lowest price');
        expect(Array.isArray(res.body.data)).toBe(true);
        if (res.body.data.length > 1) {
        expect(res.body.data[0].budget).toBeGreaterThanOrEqual(res.body.data[1].budget);
        }
    });

    // test('Database error simulation (mock)', async () => {
    //     // Example of simulating a failure scenario by mocking supabase if applicable
    //     // Mock supabase to throw an error and test how the system handles it
    //     jest.spyOn(supabase.from('job'), 'select').mockImplementationOnce(() => {
    //     throw new Error('Database connection failed');
    //     });

    //     const res = await request(app).get('/jobs');
    //     expect(res.statusCode).toBe(500);
    //     expect(res.body).toHaveProperty('message', 'Internal server error');
    // });

    // test('GET /jobs/best-price - No jobs in database', async () => {
    //     // Simulate empty DB by clearing mock database if applicable
    //     const res = await request(app).get('/jobs/best-price');
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.data.length).toBe(0);
    // });

    // test('Invalid route access', async () => {
    //     const res = await request(app).get('/jobs/non-existent-route');
    //     expect(res.statusCode).toBe(404);
    // });

});
