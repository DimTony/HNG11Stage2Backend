const request = require('supertest');
const { app } = require('../index'); // Assuming index.js is where your app is exported from

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: `testuser-${Date.now()}@example.com`, // Dynamic email to ensure uniqueness
      password: 'password123',
      phone: '1234567890',
    };

    const res = await request(app).post('/users').send(newUser).expect(201);

    // Updated field names to match the response structure
    expect(res.body).toHaveProperty('userid');
    expect(res.body.firstname).toBe(newUser.firstName);
    expect(res.body.lastname).toBe(newUser.lastName);
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.password).toBe(newUser.password);
    expect(res.body.phone).toBe(newUser.phone);
  }, 10000); // Set timeout to 10 seconds
});
