const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./db');
const routes = require('./route');

const app = express();
const PORT = 3005;

// ✅ Enable CORS so frontend (e.g., React) can communicate with backend
app.use(cors());

// ✅ Parse incoming JSON requests
app.use(bodyParser.json());

// Optional: Serve static files (if needed)
app.use(express.static('public'));

// ✅ Use your defined routes
app.use(routes);

// ✅ Sync Sequelize models with the database
sequelize.sync({ alter: true }) // or { force: true } to reset tables during dev
  .then(() => {
    console.log('✅ Database synced.');
  })
  .catch((err) => {
    console.error('❌ Error syncing database:', err.message);
  });

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
