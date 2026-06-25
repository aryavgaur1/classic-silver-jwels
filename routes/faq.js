const express = require('express');
const Faq     = require('../models/Faq');
const auth    = require('../middleware/auth');
const router  = express.Router();

// GET /api/faq  — public
router.get('/', async (req, res) => {
  try {
    const items = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/faq  — admin
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) data.id = 'f' + Date.now();
    const existing = await Faq.findOne({ id: data.id });
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return res.json(existing);
    }
    const item = new Faq(data);
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/faq/:id  — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Faq.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/faq/:id  — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Faq.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/faq/bulk  — replace all  — admin
router.post('/bulk/import', auth, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected array' });
    await Faq.deleteMany({});
    await Faq.insertMany(items);
    res.json({ success: true, count: items.length });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
