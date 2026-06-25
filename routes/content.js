const express      = require('express');
const SiteContent  = require('../models/SiteContent');
const auth         = require('../middleware/auth');
const router       = express.Router();

const VALID_KEYS = ['content', 'contact', 'settings', 'appearance'];

// GET /api/content/:key  — public
router.get('/:key', async (req, res) => {
  const key = req.params.key;
  if (!VALID_KEYS.includes(key)) return res.status(400).json({ error: 'Invalid key' });
  try {
    const doc = await SiteContent.findOne({ key });
    if (!doc) return res.json({});
    res.json(doc.data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/content/:key  — admin only (create or overwrite)
router.post('/:key', auth, async (req, res) => {
  const key = req.params.key;
  if (!VALID_KEYS.includes(key)) return res.status(400).json({ error: 'Invalid key' });
  try {
    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { key, data: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc.data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// GET /api/content  — dump all keys (public, used for full backup)
router.get('/', async (req, res) => {
  try {
    const docs = await SiteContent.find();
    const result = {};
    docs.forEach(d => { result[d.key] = d.data; });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
