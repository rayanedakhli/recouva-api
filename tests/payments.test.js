const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');
const Client = require('../src/models/Client');
const Invoice = require('../src/models/Invoice');
const Payment = require('../src/models/Payment');

const TEST_DB = 'mongodb://localhost:27017/recouvra_test';

let token, invoiceId;

beforeAll(async () => {
  await mongoose.connect(TEST_DB);

  const userRes = await request(app).post('/api/auth/register').send({
    name: 'Manager',
    email: 'pay_manager@test.com',
    password: '123456',
    role: 'manager'
  });
  token = userRes.body.token;

  const clientRes = await request(app)
    .post('/api/clients')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Pay Client', email: 'payclient@test.com', phone: '12345678' });

  const invoiceRes = await request(app)
    .post('/api/invoices')
    .set('Authorization', `Bearer ${token}`)
    .send({ client: clientRes.body.client._id, amount: 1000, dueDate: '2025-12-31' });

  invoiceId = invoiceRes.body.invoice._id;
});

afterAll(async () => {
  await Payment.deleteMany({});
  await Invoice.deleteMany({});
  await Client.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/payments', () => {
  it('should record a payment and update invoice', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ invoice: invoiceId, amount: 400, method: 'cash' });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment.amount).toBe(400);
    expect(res.body.invoice.paidAmount).toBe(400);
    expect(res.body.invoice.status).toBe('partial');
  });

  it('should mark invoice as paid when full amount is paid', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ invoice: invoiceId, amount: 600 });

    expect(res.statusCode).toBe(201);
    expect(res.body.invoice.status).toBe('paid');
  });

  it('should reject payment exceeding remaining balance', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ invoice: invoiceId, amount: 9999 });
    expect(res.statusCode).toBe(400);
  });
});
