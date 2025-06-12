// backend/routes.js
const express = require('express');
const path = require('path');
const Item = require('./models/item');
const SalesHistory = require('./models/salesHistory');

const router = express.Router();

// Serve HTML pages (for now — later replaced by React frontend)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

router.get('/item', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'item.html'));
});

router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

router.get('/sales-history', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'salesHistory.html'));
});

router.get('/prediction', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'prediction.html'));
});

// API: Items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/items', async (req, res) => {
  const { name, quantity, category, price } = req.body;
  try {
    const item = await Item.create({ name, quantity, category, price });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity } = req.body;
  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.name = name || item.name;
    item.category = category || item.category;
    if (price !== undefined) item.price = price;
    if (quantity !== undefined) item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Sales History
router.get('/api/sales-history', async (req, res) => {
  try {
    const sales = await SalesHistory.findAll({
      include: [{ model: Item }]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/sales-history', async (req, res) => {
  const { itemId, date, quantitySold } = req.body;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (item.quantity < quantitySold) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const sale = await SalesHistory.create({ itemId, date, quantitySold });
    item.quantity -= quantitySold;
    await item.save();

    res.status(201).json({ sale, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
