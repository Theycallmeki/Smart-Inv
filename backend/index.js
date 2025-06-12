// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./db');
const routes = require('./route');

const app = express();
const PORT = 3005;

app.use(bodyParser.json());
app.use(express.static('public'));

// Use routes
app.use(routes);

// Sync database
sequelize.sync().then(() => {
  console.log('✅ Database synced.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
