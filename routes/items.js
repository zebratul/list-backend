const express = require('express');
const router = express.Router();
const { ITEMS } = require('../data');

let globalSelected = [];
let globalCustomOrder = [];

// GET /items?q=...&offset=...&limit=...
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;

  let filtered = q
    ? ITEMS.filter((item) => item.name.toLowerCase().includes(q))
    : [...ITEMS];

  if (globalCustomOrder.length > 0 && !q) {
    const customSet = new Set(globalCustomOrder);
    const reordered = [
      ...globalCustomOrder
        .map((id) => filtered.find((itm) => itm.id === id))
        .filter(Boolean),
      ...filtered.filter((itm) => !customSet.has(itm.id)),
    ];
    filtered = reordered;
  }

  const paginated = filtered.slice(offset, offset + limit);
  res.json({ total: filtered.length, items: paginated });
});

router.get('/selection', (_req, res) => {
  res.json({
    selected: globalSelected,
    customOrder: globalCustomOrder,
  });
});

router.post('/selection', (req, res) => {
  const { selected } = req.body;
  globalSelected = Array.isArray(selected) ? selected : [];
  console.log(`Items selected: ${globalSelected}`);
  res.sendStatus(200);
});

router.post('/sort', (req, res) => {
  const { sortedIds } = req.body;
  globalCustomOrder = Array.isArray(sortedIds) ? sortedIds : [];
  console.log(`Items sorted: ${globalCustomOrder}`);
  res.sendStatus(200);
});

module.exports = router;
