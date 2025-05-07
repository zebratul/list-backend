const express = require('express');
const router = express.Router();
const { ITEMS } = require('../data');

// In-memory session storage helper
function getUserSession(req) {
  if (!req.session.userData) {
    req.session.userData = {
      selected: [],
      customOrder: [],
    };
  }
  return req.session.userData;
}

// GET /items?q=...&offset=...&limit=...
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;

  let filtered = q
    ? ITEMS.filter((item) => item.name.toLowerCase().includes(q))
    : [...ITEMS];

  const { customOrder } = getUserSession(req);

  if (customOrder.length > 0 && !q) {
    const customSet = new Set(customOrder);
    const reordered = [
      ...customOrder
        .map((id) => filtered.find((itm) => itm.id === id))
        .filter(Boolean),
      ...filtered.filter((itm) => !customSet.has(itm.id)),
    ];
    filtered = reordered;
  }

  const paginated = filtered.slice(offset, offset + limit);
  res.json({ total: filtered.length, items: paginated });
});

router.get('/selection', (req, res) => {
  const { selected, customOrder } = getUserSession(req);
  res.json({ selected, customOrder });
});

router.post('/selection', (req, res) => {
  const { selected } = req.body;
  console.log(`Items selected ${selected}`);
  const session = getUserSession(req);
  session.selected = Array.isArray(selected) ? selected : [];
  res.sendStatus(200);
});

router.post('/sort', (req, res) => {
  const { sortedIds } = req.body;
  console.log(`Items sorted ${sortedIds}`);
  const session = getUserSession(req);
  session.customOrder = Array.isArray(sortedIds) ? sortedIds : [];
  res.sendStatus(200);
});

module.exports = router;

