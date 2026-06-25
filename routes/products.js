const express  = require('express');
const Product  = require('../models/Product');
const auth     = require('../middleware/auth');
const router   = express.Router();

// GET /api/products  — public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/products/:id  — public
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findOne({ id: req.params.id });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/products  — admin only
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = data.code + '-' + Date.now();
    const existing = await Product.findOne({ id: data.id });
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return res.json(existing);
    }
    const p = new Product(data);
    await p.save();
    res.status(201).json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/products/:id  — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Product.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/products/:id  — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/products/bulk  — import all  — admin only
router.post('/bulk/import', auth, async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: 'Expected array' });
    await Product.deleteMany({});
    await Product.insertMany(products);
    res.json({ success: true, count: products.length });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
