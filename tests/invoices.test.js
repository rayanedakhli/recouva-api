const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Client = require('../src/models/Client');
const Invoice = require('../src/models/Invoice');

const TEST_DB = 'mongodb://localhost:27017/recouvra_test';

let managerToken, clientId;

beforeAll(async () => {
  await mongoose.connect(TEST_DB);

  // Create manager user
  const res = await request(app).post('/api/auth/register').send({
    name: 'Manager',
    email: 'manager@test.com',
    password: '123456',
    role: 'manager'
  });
  managerToken = res.body.token;

  // Create client
  const clientRes = await request(app)
    .post('/api/clients')
    .set('Authorization', `Bearer ${managerToken}`)
    .send({ name: 'Test Client', email: 'client@test.com', phone: '12345678' });
  clientId = clientRes.body.client._id;
});

afterAll(async () => {
  await Invoice.deleteMany({});
  await Client.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

afterEach(async () => {
  await Invoice.deleteMany({});
});

describe('POST /api/invoices', () => {
  it('should create an invoice', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        client: clientId,
        amount: 1000,
        dueDate: '2027-12-31',
        description: 'Test invoice'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.invoice).toHaveProperty('invoiceNumber');
    expect(res.body.invoice.amount).toBe(1000);
    expect(res.body.invoice.status).toBe('pending');
  });

  it('should fail without required fields', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ client: clientId });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/invoices', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ client: clientId, amount: 500, dueDate: '2027-12-31' });
  });

  it('should get all invoices', async () => {
    const res = await request(app)
      .get('/api/invoices')
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.invoices.length).toBeGreaterThan(0);
  });

  it('should filter invoices by status', async () => {
    const res = await request(app)
      .get('/api/invoices?status=pending')
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.statusCode).toBe(200);
    res.body.invoices.forEach(inv => expect(inv.status).toBe('pending'));
  });
});
