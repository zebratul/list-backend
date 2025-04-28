// index.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'dev_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use('/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
