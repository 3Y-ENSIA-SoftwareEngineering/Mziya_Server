const request = require('supertest'); // used to send http requestto test api endpoint
const app = require('../../src/app');
const supabase = require('../../src/config/database');
const JobService = require('../../src/services/jobService');


// group related tests for testing JOb Posting API
describe('JOb Posting API', ()=>{
    // *** sample valid job data for testing
    const validJobData = {
        home_owner_id: 1,
        description: "Looking for a skilled plumber to fix bathroom pipes",
        location: "Sidi Abdellah",
        job_type: "small_task",
        job_category: "Plumbing",
        budget: 500,
        status: "pending",
        availability_type: "closed",
        start_date: "2024-12-10",
        end_date: "2024-12-15",
        age_matters: true,
        age_min: 30,
        age_max: 50,
        gender_matters: false,
        required_gender: "any",
        additional_details: "Preferably experienced plumber"
    };

    // *** setup and teardown

    // run setup code before running and test in the suite
    beforeAll(async ()=> {
        //await supabase.query('DELETE FROM jobs'); // clear jobs table
    });

    // run cleanup code after tests are done
    afterAll(async ()=> {
        //await supabase.end(); // close connection
    });

    // *** test suite 1: Successful Job posting
    describe('Successful Job Posting', () => {
        it('should create a new job with valid data', async () => {
            const response = await request(app)
                .post('/api/jobs/addjob')
                .send(validJobData)
                .expect(201);
    
        // Validate response structure
        expect(response.body).toHaveProperty('message', 'New job created successfully');
        expect(response.body).toHaveProperty('job');
        expect(response.body.job).toHaveProperty('id');
    
        // Additional checks on returned job
        const createdJob = response.body.job;
        expect(createdJob.description).toBe(validJobData.description);
        expect(createdJob.budget).toBe(validJobData.budget);
        });
    });


    // *** Test Suite 2: Input validation Failures
    describe('Input validation Failures', () => {
        // test invalid home_owner_id
        it('should reject job posting with invalid home_owner_id', async () => {
        const invalidJob = { ...validJobData, home_owner_id: -1 };
        
        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(invalidJob)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'validation failed');
        expect(response.body.errors).toBeInstanceOf(Array);
        expect(response.body.errors[0].msg).toContain('Home owner ID is required and must be positive integer');
        });

        // test invalid description length
        it('should reject job posting with too short description', async () => {
        const invalidJob = { ...validJobData, description: "Too short" };
        
        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(invalidJob)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'validation failed');
        expect(response.body.errors[0].msg).toContain('Description must be between 10 and 500 characters');
        });

        // test invalid job type
        it('should reject job posting with invalid job type', async () => {
        const invalidJob = { ...validJobData, job_type: "invalid_type" };
        
        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(invalidJob)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'validation failed');
        expect(response.body.errors[0].msg).toContain('Job type must be one of');
        });

        // test date logic
        it('should reject job posting with end date before start date', async () => {
        const invalidJob = { 
            ...validJobData, 
            start_date: "2024-12-15", 
            end_date: "2024-12-10" 
        };
        
        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(invalidJob)
            .expect(400);

        expect(response.body).toHaveProperty('message', 'validation failed');
        expect(response.body.errors[0].msg).toContain('End date must be later than start date');
        });
    });


     // Test Suite 3: Edge Cases
    describe('Edge Cases', () => {
        // test optional fields
        it('should create job with minimal required fields', async () => {
        const minimalJob = {
            home_owner_id: 1,
            description: "Minimal job description that meets length requirements",
            location: "Test Location",
            job_type: "small_task",
            job_category: "Plumbing",
            budget: 100,
            status: "pending",
            availability_type: "open",
            age_matters: false,
            gender_matters: false,
            required_gender: "any"
        };

        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(minimalJob)
            .expect(201);

        expect(response.body).toHaveProperty('job');
        });

        // test maximum length fields
        it('should handle maximum length description', async () => {
        const longDescriptionJob = {
            ...validJobData,
            description: "A".repeat(500) // maximum allowed length
        };

        const response = await request(app)
            .post('/api/jobs/addjob')
            .send(longDescriptionJob)
            .expect(201);

        expect(response.body).toHaveProperty('job');
        });
    });


    // *** Test Suite 4: Error Handling
    describe('Error Handling', () => {
        // simulate database connection error
        it('should handle database insertion errors', async () => {
        // mock Supabase to simulate insertion failure
        const originalCreate = JobService.create;
        JobService.create = jest.fn().mockRejectedValue(new Error('Database insertion failed'));

        try {
            const response = await request(app)
            .post('/api/jobs/addjob')
            .send(validJobData)
            .expect(500);

            expect(response.body).toHaveProperty('message', 'Internal server error');
        } finally {
            // restore original method
            JobService.create = originalCreate;
        }
        });
    });
})