const express = require('express');
const router = express.Router();
const { ITEMS } = require('../data');

// Helper to simulate in-memory session storage
function getUserSession(req) {
  if (!req.session.userData) {
    req.session.userData = {
      selected: new Set(),
      customOrder: [],
    };
  }
  return req.session.userData;
}

// GET /items?q=search&offset=0&limit=20
router.get('/', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let filtered = q
    ? ITEMS.filter((item) => item.name.toLowerCase().includes(q))
    : [...ITEMS];

  const { customOrder } = getUserSession(req);
  if (customOrder.length > 0 && !q) {
    const customSet = new Set(customOrder);
    const reordered = [
      ...customOrder.map((id) => filtered.find((item) => item.id === id)).filter(Boolean),
      ...filtered.filter((item) => !customSet.has(item.id)),
    ];
    filtered = reordered;
  }

  const paginated = filtered.slice(offset, offset + limit);
  res.json({ total: filtered.length, items: paginated });
});

router.get('/selection', (req, res) => {
  const { selected, customOrder } = getUserSession(req);
  res.json({
    selected: Array.from(selected),
    customOrder,
  });
});

router.post('/selection', (req, res) => {
  const { selected } = req.body;
  const session = getUserSession(req);
  session.selected = new Set(selected);
  res.sendStatus(200);
});

router.post('/sort', (req, res) => {
  const { sortedIds } = req.body;
  const session = getUserSession(req);
  session.customOrder = sortedIds;
  res.sendStatus(200);
});

module.exports = router;
