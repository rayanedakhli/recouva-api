require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./src/config/db');
const swaggerSpec = require('./src/config/swagger');
const errorHandler = require('./src/middlewares/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const recoveryRoutes = require('./src/routes/recoveryRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const app = express();

// Connect DB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Recouvra+ API is running',
    docs: '/api/docs',
    version: '1.0.0'
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api/docs`);
  });
}

module.exports = app;
